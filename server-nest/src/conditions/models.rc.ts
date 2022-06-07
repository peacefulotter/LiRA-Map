import { Measurement } from "src/models";

export interface Node {
    lat: number;
	lng: number;
	way_dist: number;
}

export type Ways = Map<string, Node[]>

export interface ConditionPoint {
    way_id: string;
	way_dist: number;
	value: number;
}

export type WayConditions = ConditionPoint[]

export interface MapConditions {
	way_id: string;
	way_length: number;
	nodes: Node[];
	properties: Measurement;
	conditions: WayConditions;
}