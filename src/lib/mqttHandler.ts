import * as mqtt from "mqtt";
import { MQTT_USERNAME, MQTT_PASSWORD, MQTT_PORT, MQTT_HOST, MQTT_STATE_TOPIC, MQTT_STATUS_TOPIC } from "./constants";
import type { OpenSmartCityHome } from "../main"; // Import type from your main file

/** Handles MQTT connection and message processing for sensor/station updates. */
export class MqttHandler {
	private client: mqtt.MqttClient | null = null;
	private adapter: OpenSmartCityHome;

	constructor(adapter: OpenSmartCityHome) {
		this.adapter = adapter;
	}

	public connect(): void {
		if (this.adapter.isUnloaded) {
			return;
		}
		if (this.client) {
			this.destroy();
		}

		this.client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`, {
			username: MQTT_USERNAME,
			password: MQTT_PASSWORD,
			clientId: `iobroker_${this.adapter.namespace}`,
			reconnectPeriod: 10000,
			clean: true,
		});

		const topics = [MQTT_STATE_TOPIC, MQTT_STATUS_TOPIC];

		this.client.on("connect", async () => {
			if (this.adapter.isUnloaded) {
				this.client?.end(true);
				return;
			}
			this.adapter.log.info(`(PID: ${process.pid}) [MQTT] Connected. Subscribing to ${topics.join(",")}`);
			this.client?.subscribe(topics);
			await this.adapter.setState("info.connection", true, true);
		});

		this.client.on("message", async (topic, message) => {
			if (this.adapter.isUnloaded || !this.client) {
				return;
			}
			await this.processMessage(topic, message.toString());
		});

		this.client.on("error", err => {
			if (!this.adapter.isUnloaded) {
				this.adapter.log.error(`[MQTT] Error: ${err.message}`);
			}
		});

		this.client.on("close", async () => {
			if (!this.adapter.isUnloaded) {
				await this.adapter.setState("info.connection", false, true);
			}
		});
	}

	public destroy(): void {
		if (this.client) {
			this.client.removeAllListeners();
			this.client.on("error", () => {}); // Prevent unhandled errors during shutdown
			this.client.end(true);
			this.client = null;
		}
	}

	private async processMessage(topic: string, message: string): Promise<void> {
		if (this.adapter.isUnloaded) {
			return;
		}

		const parts = topic.split("/");
		if (parts.length < 4) {
			return;
		}

		const messageType = parts[1];
		const messageId = parts[2];
		const messagePath = parts[3];

		if (messageType === "sensor" && messagePath === "state") {
			// Access the map from the adapter instance
			const stateId = this.adapter.sensorToStateIdMap[messageId];
			const val = parseFloat(message);
			if (stateId && !isNaN(val)) {
				await this.adapter.setState(stateId, val, true);
			}
		} else if (messageType === "station" && messagePath === "status") {
			if (messageId && message) {
				// Convert string status to Boolean
				const isSending = "online" == message;
				await this.adapter.setState(`${messageId}.sendingData`, isSending, true);
			}
		}
	}
}
