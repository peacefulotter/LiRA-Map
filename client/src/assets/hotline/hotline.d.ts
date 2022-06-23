
import Hotline from "./renderers/Hotline";


export interface HotlineOptions {
	min?: number;
	max?: number;
	weight?: number;
	outlineWidth?: number;
	outlineColor?: string;
	palette?: Palette;
	onclick?: (e: any) => void;
}

export type HotlineClass<DataT> = new (options?: HotlineOptions) => Hotline<DataT>; 

// LatLngHotline
export type LatLngInput = LatLngExpression[]
export interface LatLngPoint { x: number, y: number, z: number, i: number };
export type LatLngData = LatLngPoint[]

// DistHotline 
export type DistInput = [number, number][]
export interface DistPoint { x: number, y: number, i: number, way_dist: number };
export type DistData = DistPoint[]

export type ReactHotline<T, U, V, W> = (data: T, options: HotlineOptions) => [HotPolyline<V, U>, W]