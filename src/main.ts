import * as utils from "@iobroker/adapter-core";
import type { OpenSmartCityConfig } from "./lib/types";
import { handleReady } from "./lib/readyHandler";
import { handleMessage } from "./lib/messageHandler";
import { handleUnload } from "./lib/unloadHandler"; // Import the new handler
import { MqttHandler } from "./lib/mqttHandler";

/**
 * OpenSmartCityHome
 */
export class OpenSmartCityHome extends utils.Adapter {
	declare public config: OpenSmartCityConfig & ioBroker.AdapterConfig;

	// Helper properties need to be public for the handler
	public sensorToStateIdMap: Record<string, string> = {};
	public isUnloaded: boolean = true;

	// Instance of the new handler
	public mqttHandler: MqttHandler;

	/**
	 * Constructor
	 *
	 * @param options
	 */
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "open-smart-city-home",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("unload", this.onUnload.bind(this));
		this.on("message", this.onMessage.bind(this));

		// Initialize handler
		this.mqttHandler = new MqttHandler(this);
	}

	private async onReady(): Promise<void> {
		this.isUnloaded = false;

		// Prepare objects and maps
		await handleReady(this);

		// Start MQTT connection
		this.mqttHandler.connect();
	}

	private async onMessage(obj: ioBroker.Message): Promise<void> {
		await handleMessage(this, obj);
	}

	private async onUnload(callback: () => void): Promise<void> {
		this.isUnloaded = true;

		await handleUnload(this, callback);
	}
}

if (require.main !== module) {
	module.exports = (options: any) => new OpenSmartCityHome(options);
} else {
	new OpenSmartCityHome();
}
