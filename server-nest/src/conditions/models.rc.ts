import { LatLng, Measurement } from "src/models";

export interface Way {
    id: number;
    geom: LatLng[];
    length: number;
}

export interface ConditionPoint {
    way_id: string;
	way_dist: number;
	value: number;
}

export type WayConditions = ConditionPoint[]

export interface MapConditions {
	way: Way;
	properties: Measurement;
	conditions: WayConditions
}