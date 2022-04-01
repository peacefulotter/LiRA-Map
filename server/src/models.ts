



// represents the metadata of a ride
export interface RideMeta {
	TripId: string,
	TaskId: number,
	StartTimeUtc: string,	// "2021-04-27T18:11:02.223Z"
	EndTimeUtc: string, // 	"2021-04-27T18:57:18.551Z"
	StartPositionLat: string, // 	"55.683240"
	StartPositionLng: string, // 	"12.584890"
	StartPositionDisplay: string, // 	"{\"ntk_geocode_time\":48…2,\"type\":\"geocode\"}"
	EndPositionLat: string, // 	"55.711580"
	EndPositionLng: string, // 		"12.570990"
	EndPositionDisplay: string, // 		"{\"ntk_geocode_time\":31…"house_number\":\"37\"}"
	Duration: string, // 		"2021-07-30T00:46:16.327Z"
	DistanceKm: number, // 		86.0269352289332
	FK_Device: string, // 	"d25574dd-e9a4-4296-ae00-7dcef3aa8278"
	Created_Date: string, // 		"2021-07-30T07:52:47.969Z"
	Updated_Date: string, // 		"0001-01-01T00:00:00.000Z"
}

export interface LatLng {
	lat: number;
	lng: number;
}

export interface PointData extends LatLng {
	properties?: PointProperties;
	value?: number;
	metadata?: any;
}

export type Path = PointData[]

export interface DataPath {
	path: Path;
	minValue?: number;
    maxValue?: number;
    minTime?: number;
    maxTime?: number;
}

export enum RendererName {
    circle = 'circle',
    circles = 'circles',
    rectangles = 'rectangles',
    line = 'line',
    hotline = 'hotline',
    hotpoints = 'hotpoints'
}

// Rendering properties of a single point belonging to a Path
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
	rendererName: RendererName;
	query: string;
	queryMeasurement: string,
	name: string;
	// Needs to be specified if the points have a value attached to them
	hasValue?: boolean;
}

// JSON files must follow this format
export interface PathProps {
	dataPath: DataPath
	properties: PathProperties;
	metadata?: {[key: string]: any}
}

export type Measurements = string[];

export type Position3D = {
	x: number;
	y: number;
	z: number;
}