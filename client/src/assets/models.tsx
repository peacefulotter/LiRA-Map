
import { LatLng } from 'leaflet';

export enum RoadCondition {
    'Good', 'Correct', 'Bad'
  }
  
export interface RoadModel {
  paths: LatLng[][],
  conditions: RoadCondition[]
}