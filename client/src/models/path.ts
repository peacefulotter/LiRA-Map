// Represents a point containing (lat, lng) coordinates, 

import { LatLng } from "./models";
import { Measurement, PathProperties, PointProperties } from "./properties";
import { PathEventHandler } from "./renderers";

// rendering properties, and optionally, a value and some metadata (like timestamp)
export interface PointData extends LatLng {
	properties?: PointProperties;
	value?: number;   	   			
	metadata?: any;
}

// A Path is a collection of points
export type Path = PointData[]

// A DataPath is a Path with informations on the latter
export interface DataPath {
	path: Path;
	minY: number;
    maxY: number; 
    minX: number;
    maxX: number;
}

// Props passed to the Path and EventPath components
export interface PathProps {
	dataPath: DataPath
	properties: PathProperties;
	metadata?: {[key: string]: any}
	onClick?: PathEventHandler
}

// This interface is used as a type for server's response
// for instance, JSON files follow this format
export interface JSONProps {
	dataPath: DataPath
	properties: Measurement;
	metadata?: {[key: string]: any}
}
