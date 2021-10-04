


export enum RoadCondition {
  'Good', 'Correct', 'Bad'
}

// the backend doesnt have leaflet (yet?)
interface LatLng {
  lat: number,
  lng: number
}

export interface RoadSegment {
  path: LatLng[],
  condition: RoadCondition
}
  
export type RoadSegments = RoadSegment[];

// represents the metadata of a ride
interface RideMeta {
  time: number,
  distance: number
}

// represents one ride: a model + meta data of the ride
interface Ride {
  segments: RoadSegments,
  meta: RideMeta
}

export type RidesModel = Ride[];