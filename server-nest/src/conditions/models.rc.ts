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

export type RoadConditions = ConditionPoint[]

export interface MapRoadConditions { 
    properties: Measurement;
    conditions: RoadConditions;
}

export interface TripCondition {
	way: Way;
	zoom: MapRoadConditions;
	road: RoadConditions;
}

export type TripConditions = TripCondition[]