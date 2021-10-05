
import { LatLng } from 'leaflet';

enum RoadCondition {
  'Good', 'Correct', 'Bad'
}

export interface RoadSegment {
  path: LatLng[],
  condition: RoadCondition
}
  
export type RoadSegments = RoadSegment[];

// represents the metadata of a ride
export interface RideMeta {
  time: number,
  distance: number
}

// represents one ride: a model + meta data of the ride
export interface Ride {
  segments: RoadSegments,
  meta: RideMeta
}

export type RidesModel = Ride[];