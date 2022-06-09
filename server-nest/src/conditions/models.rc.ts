import { Measurement, RendererName } from "src/models";

export interface Node {
    lat: number;
	lng: number;
	way_dist: number;
}

export type Ways = Map<string, Node[]>

export interface ConditionPoint {
	way_dist: number;
	value: number;
}

export type WayConditions = ConditionPoint[]

export type WayId = string;

export interface MapCondition {
	way_length: number;
	nodes: Node[];
	conditions: WayConditions;
}

export type MapConditions = { [key: WayId]: MapCondition }

