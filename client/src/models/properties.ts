import { RendererName } from "./renderers";

// If an attribute is defined for a point, it overwrites the properties for the path
export interface PointProperties {
	// Color of a point or the entire path 
	color?: string;
	// Radius or largeness of a point or the entire path
	width?: number;
	// Weight (boldness) of a point or the entire path
	weight?: number;
	// Opacity (between 0 and 1) of a point or the entire path
	opacity?: number;
}

// Rendering properties of an entire Path
export interface PathProperties extends PointProperties {
	// The name of the renderer to use - see ./renderers for the list of names
	rendererName: RendererName;
	// Weight will depend on the value - the dilatationFactor will control how big a weight
	// grows depending on the value. 
	// 	< 1 -> shrinks
	//  > 1 -> grows
	//  == 1 -> stays the same
	dilatationFactor?: number;
}

export interface Measurement extends PathProperties {
	query: string;
	queryMeasurement: string,
	name: string;
	// Needs to be specified if the points have a value attached to them 
	hasValue?: boolean;
	// TODO: min max value if hasValue true
}

export interface RideMeasurement extends Measurement {
	isActive: boolean; // true if measurement is displayed, false otherwise
}