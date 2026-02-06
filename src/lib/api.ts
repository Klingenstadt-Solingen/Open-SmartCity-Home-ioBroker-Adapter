import type { StationData, SensorData } from "./types";
import axios from "axios";
import { API_PASSWORD, API_URL, API_USER } from "./constants";

/**
 * Fetches stations
 *
 * @param log
 */
export async function fetchStations(log: ioBroker.Logger): Promise<StationData[]> {
	try {
		const response = await axios.get(API_URL, {
			auth: {
				username: API_USER,
				password: API_PASSWORD,
			},
			timeout: 5000,
			headers: {
				Connection: "close",
			},
		});

		if (response.status !== 200) {
			return [];
		}

		return response.data
			.map((node: any): StationData | null => {
				if (!node || !node.id || !node.name) {
					log.error(`[API] Received invalid station data from API: ${JSON.stringify(node)}`);
					return null;
				}

				const sensors: SensorData[] = (node.sensors || []).map((s: any) => ({
					sensorId: s.id?.toString(),
					sensorName: s.name?.toString(),
					sensorUnit: s.unit?.toString(),
					sensorState: parseFloat(s.state) || 0,
				}));

				return {
					stationId: node.id.toString(),
					stationName: node.name.toString(),
					stationStatus: (node.status || "unknown").toLowerCase(),
					sensors,
				};
			})
			.filter((st: StationData | null): st is StationData => st !== null);
	} catch (e: any) {
		log.error(`[API] Fetch failed: ${e.message}`);
		return [];
	}
}
