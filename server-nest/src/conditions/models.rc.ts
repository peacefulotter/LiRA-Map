import { LatLng } from "src/models";

export interface LatLon {
    lat: number;
    lon: number;
}

export interface Way {
    way_id: number;
    geometry: LatLng[];
    length: number;
}