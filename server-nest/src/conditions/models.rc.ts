import { LatLng, Measurement } from "src/models";

export interface Way {
    id: number;
    geom: LatLng[];
    length: number;
}

export interface ConditionPoint {
	way_dist: number;
	value: number;
}

export type RoadConditions = ConditionPoint[]
export type WayConditions = { [key: number]: RoadConditions }

export interface MapWayConditions { 
    path: RoadConditions;
    properties: Measurement
}

export interface TripConditions {
	ways: Way[];
	zoom: RoadConditions;
	road: MapWayConditions;
}