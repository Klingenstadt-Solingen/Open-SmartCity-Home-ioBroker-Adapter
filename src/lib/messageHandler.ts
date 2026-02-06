import { fetchStations } from "./api";
import type { OpenSmartCityConfig } from "./types";

interface AdapterWithConfig extends ioBroker.Adapter {
	config: OpenSmartCityConfig & ioBroker.AdapterConfig;
}

/**
 * Populates the Instance table.
 *
 * @param adapter
 * @param obj
 */
export async function handleMessage(adapter: AdapterWithConfig, obj: ioBroker.Message): Promise<void> {
	if (obj.command === "getStations") {
		try {
			// 1. Fetch live data from API
			const apiStations = await fetchStations(adapter.log);

			// 2. Determine which stations are currently active in the config
			const activeStationIds = new Set(
				(adapter.config.stations || [])
					.filter(s => s.requestingData) // Only keep active ones
					.map(s => s.stationId),
			);

			const mergedStations = apiStations.map(apiStation => {
				const isActive = activeStationIds.has(apiStation.stationId);
				return {
					...apiStation,
					requestingData: isActive, // True if found in the activeSet
				};
			});

			adapter.sendTo(obj.from, obj.command, mergedStations, obj.callback);
		} catch (e: any) {
			adapter.log.error(`(PID: ${process.pid}) [onMessage] [getStations] Error: ${e.message}`);
			adapter.sendTo(obj.from, obj.command, [], obj.callback);
		}
	}
}
