export interface SensorData {
	sensorId: string;
	sensorName: string;
	sensorUnit: string;
	sensorState: number;
}

export interface StationData {
	stationId: string;
	stationName: string;
	stationStatus: string;
	sensors: SensorData[];
}

export interface OpenSmartCityConfig {
	stations: Array<{
		stationId: string;
		stationName: string;
		requestingData: boolean; // "Is it active/sending data?"
		stationStatus: string; // "Can I request data?"
		sensors: SensorData[];
	}>;
}
