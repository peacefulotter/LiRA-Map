import { LatLng } from "leaflet";
import { Segment } from "../models/segment";
import { AggregationMethod, ComputedValueType } from "../pages/CarData";


export const GetSegmentsAndAverageValuesInAPolygon = async (points: LatLng[], type: number, aggregation: number, direction: number): Promise<Segment[]> => {

    // const northEastString = points[0].lat + " " + points[0].lng;
    // const southEastString = points[1].lat + " " + points[1].lng;
    // const southWestString = points[2].lat + " " + points[2].lng;
    // const northWestString = points[3].lat + " " + points[3].lng;
    const bounds = points.map( p => p.lat + ' ' + p.lng ).join(';')
    const path = '/segments/polygon/'+ bounds + '?type=' + type +  '&aggregation=' + aggregation +  '&direction=' + direction;
    console.log(path)
    const res = await fetch(path)
    return await res.json();
}


export const GetDataTypes = async (): Promise<ComputedValueType[]> => {
    const path = '/types/aggregatedValues/types'
    const res = await fetch(path);
    const data = await res.json();
    console.log(data)
    return data.map( (elt: any) => <ComputedValueType>{id: elt.id, name: elt.name, description: elt.description, units: elt.units});
}

export const GetAggregationTypes = async (dataType: number): Promise<AggregationMethod[]> => {
    const path = '/types/aggregatedValues/aggregation' + '?type=' + dataType;
    const res = await fetch(path);
    const data = await res.json();
    return data.map( (elt: any) => <AggregationMethod>{id: elt.id, name: elt.name, description: elt.description} );
}

export const GetDataTypesOfSegment = async (segment_id: number): Promise<ComputedValueType[]> => {
    const path = '/types/aggregatedValues/types/' + segment_id;
    const res = await fetch(path);
    const data = await res.json();
    return data.map( (elt: any) => <ComputedValueType>{id: elt.id, name: elt.name, description: elt.description, units: elt.units} );
}

export const GetAggregationTypesOfSegment = async (dataType: number, segment_id: number): Promise<AggregationMethod[]> => {
    const path = '/types/aggregatedValues/aggregation/' + segment_id + '?type=' + dataType;
    const res = await fetch(path);
    const data = await res.json();
    return data.map( (elt: any) => <AggregationMethod>{id: elt.id, name: elt.name, description: elt.description} );
}

export const GetSegmentAndAggregateValue = async (type: number, aggregation: number, segment_id: number, direction:number): Promise<Segment[]> => {
    const path = '/segments/'+ segment_id + '?type=' + type +  '&aggregation=' + aggregation +  '&direction=' + direction;
    console.log(path)
    const res = await fetch(path)
    console.log(res)
    const data = await res.json();
    return data;
}