import { Palette } from "react-leaflet-hotline";
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
	// Outline of a point or an entire path
	stroke?: boolean;
}

// Rendering properties of an entire Path
export interface PathProperties extends PointProperties {
	// The name of the renderer to use - see ./renderers for the list of names
	rendererName: RendererName;
	// Weight can be multiplied by the dilatationFactor
	// 	< 1 -> shrinks ; > 1 -> grows ; == 1 -> stays the same
	dilatationFactor?: number;
	// Palette used for coloring the path and graph
	palette?: Palette;
	// Whether to show the arrow head or not, 0 no arrowhead, 1 = first dir, 2 = other dir, 3 = both dir
	arrowHead?: number
}

export interface RendererOptions extends PathProperties {
	min?: number;
	max?: number;
}

export interface Measurement extends PathProperties {
	// measurement as it is in the database
	dbName: string;
	// human friendly name of the measurement 
	name: string; 
	// Needs to be specified if the points have a value attached to them 
	hasValue?: boolean;
}

export interface RideMeasurement extends Measurement {
	isActive: boolean; // true if measurement is displayed, false otherwise
}