import { MarkerData } from '../assets/graph/types';

export interface ConditionType {
  name: string;
  min: number;
  max: number;
  grid: boolean;
  samples?: number;
}

/** @author Benjamin Lumbye s204428, Mads Westermann s174508 */
export interface UseMarkersAction {
  taskID: number;
  measurementName: string;
  data: MarkerData;
  source: 'GRAPH' | 'MAP';
}
