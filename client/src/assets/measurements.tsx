
// TODO: put this on the db

export type Measurement = {
	rendererIndex: number;
	query: string;
	queryMeasurement?: string,
	name: string;
	defaultColor: string;
	size?: number;
	value?: string;
}
	
export const Measurements: Measurement[] = [
	{ 
    	rendererIndex: 0,
		query: '/trip_measurement', 
        queryMeasurement: 'track.pos',     
		name: 'Track Pos',     
		defaultColor: "#AA00CC", 
	},
	{ 
		rendererIndex: 2,
		query: '/trip_measurement',
        queryMeasurement: 'acc.xyz', 
		name: 'Interpolation', 
		defaultColor: "#2288DD",
	},
	{ 
		rendererIndex: 2,
		query: '/map_match',
		name: 'Map Matching', 
		defaultColor: "#0000FF", 
		size: 0.00003, 
		value: 'object' 
	},
	{ 
		rendererIndex: 3,
		query: '/trip_measurement', 
		queryMeasurement: 'obd.rpm',
		name: 'Engine RPM',    
		defaultColor: "#FF00FF", 
		value: 'number', 
	}
]