import { MarkerData } from '../assets/graph/types';

export interface ConditionType {
  name: string;
  min: number;
  max: number;
  grid: boolean;
  samples?: number;
}

export interface UseMarkersAction {
  taskID: number;
  measurementName: string;
  data: MarkerData;
  source: 'GRAPH' | 'MAP';
}
