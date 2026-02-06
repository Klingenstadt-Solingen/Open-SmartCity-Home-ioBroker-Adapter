import type { OpenSmartCityHome } from "../main";

/**
 * Handles the unload event
 * 1. Sets all active stations to offline (icon + state)
 * 2. Destroys MQTT connection
 * 3. Calls the system callback
 *
 * @param adapter The adapter instance
 * @param callback The ioBroker callback to confirm unload
 */
export async function handleUnload(adapter: OpenSmartCityHome, callback: () => void): Promise<void> {
	const label = `[handleUnload]`;

	const cleanup = async (): Promise<void> => {
		try {
			adapter.log.info(`${label} Stopping...`);

			const tasks: Promise<any>[] = [];

			// 1. Set Stations Offline
			if (adapter.config.stations && Array.isArray(adapter.config.stations)) {
				for (const station of adapter.config.stations) {
					// Only touch stations that were active
					if (station.requestingData) {
						// Set sendingData to false
						tasks.push(
							adapter.setState(`${station.stationId}.sendingData`, {
								val: false,
								ack: true,
							}),
						);

						// Set Icon to red
						tasks.push(
							adapter.extendObject(station.stationId, {
								common: {
									icon: "images/red.png",
								},
							}),
						);
					}
				}
			}

			if (tasks.length > 0) {
				await Promise.all(tasks);
				adapter.log.debug(`${label} Set ${tasks.length / 2} stations to offline.`);
			}

			// 2. Destroy MQTT Handler
			if (adapter.mqttHandler) {
				adapter.mqttHandler.destroy();
			}
		} catch (e: any) {
			adapter.log.error(`${label} Error during cleanup: ${e.message}`);
		} finally {
			callback();
		}
	};

	await cleanup();
}
