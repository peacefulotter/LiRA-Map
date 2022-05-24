import { LatLng } from "leaflet";
import { Segment } from "../models/segment";


export const GetSegmentsAndAverageValuesInAPolygon = async (points: LatLng[], type: [number, string], aggregation: [number, string], direction: number): Promise<Segment[]> => {

    // const northEastString = points[0].lat + " " + points[0].lng;
    // const southEastString = points[1].lat + " " + points[1].lng;
    // const southWestString = points[2].lat + " " + points[2].lng;
    // const northWestString = points[3].lat + " " + points[3].lng;
    const bounds = points.map( p => p.lat + ' ' + p.lng ).join(';')
    const path = '/segments/polygon/'+ bounds + '?type=' + type[0] +  '&aggregation=' + aggregation[0] +  '&direction=' + direction;
    console.log(path)
    const res = await fetch(path)
    return await res.json();
}


export const GetDataTypes = async (): Promise<[number, string][]> => {
    const path = '/types/aggregatedValues/types'
    const res = await fetch(path);
    const data = await res.json();
    console.log(data)
    return data.map( (elt: any) => [elt.id, elt.name]);
}

export const GetAggregationTypes = async (dataType: [number, string]): Promise<[number, string][]> => {
    const path = '/types/aggregatedValues/aggregation' + '?type=' + dataType[0];
    const res = await fetch(path);
    const data = await res.json();
    return data.map( (elt: any) => [elt.id, elt.name] );
}

export const GetDataTypesOfSegment = async (segment_id: number): Promise<string[]> => {
    const path = '/types/aggregatedValues/types/' + segment_id;
    const res = await fetch(path);
    const data = await res.json();
    return data.map( (elt: any) => [elt.id, elt.name] );
}

export const GetAggregationTypesOfSegment = async (dataType: [number, string], segment_id: number): Promise<string[]> => {
    const path = '/types/aggregatedValues/aggregation/' + segment_id + '?type=' + dataType[0];
    const res = await fetch(path);
    const data = await res.json();
    return data.map( (elt: any) => [elt.id, elt.name] );
}

export const GetSegmentAndAggregateValue = async (type: [number, string], aggregation: [number, string], segment_id: number, direction:number): Promise<Segment[]> => {
    const path = '/segments/'+ segment_id + '?type=' + type[0] +  '&aggregation=' + aggregation[0] +  '&direction=' + direction;
    console.log(path)
    const res = await fetch(path)
    console.log(res)
    const data = await res.json();
    return data;
}