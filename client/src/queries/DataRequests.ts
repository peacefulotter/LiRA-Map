import { LatLng } from "leaflet";
import { SegmentProps } from "../Components/CarData/Segment";


export const GetSegmentsAndAverageValuesInAPolygon = async (points: LatLng[], type: string, aggregation: string): Promise<SegmentProps[]> => {

    const northEastString = points[0].lat + " " + points[0].lng;
    const southEastString = points[1].lat + " " + points[1].lng;
    const southWestString = points[2].lat + " " + points[2].lng;
    const northWestString = points[3].lat + " " + points[3].lng;

    let path = '/segments/polygon/'+ northEastString +';'+ southEastString +';'+ southWestString +';'+ northWestString +
     '?type=' + type +  '&aggregation=' + aggregation;
    console.log(path)
    let res = await fetch(path)
    let data = await res.json();
    return data
}


export const GetDataTypes = async (): Promise<string[]> => {
    const path = '/types/aggregatedValues/types'
    const res = await fetch(path);
    const data = await res.json();
    return data.map( (elt: any) => elt.Type );
}

export const GetAggregationTypes = async (dataType: string): Promise<string[]> => {
    const path = '/types/aggregatedValues/aggregation' + '?type=' + dataType;
    const res = await fetch(path);
    const data = await res.json();
    return data.map( (elt: any) => elt.Aggregation );
}

export const GetDataTypesOfSegment = async (segment_id: number): Promise<string[]> => {
    const path = '/types/aggregatedValues/types/' + segment_id;
    const res = await fetch(path);
    const data = await res.json();
    return data.map( (elt: any) => elt.Type );
}

export const GetAggregationTypesOfSegment = async (dataType: string, segment_id: number): Promise<string[]> => {
    const path = '/types/aggregatedValues/aggregation/' + segment_id + '?type=' + dataType;
    const res = await fetch(path);
    const data = await res.json();
    return data.map( (elt: any) => elt.Aggregation );
}

export const GetSegmentAndAggregateValue = async (type: string, aggregation: string, segment_id: number): Promise<SegmentProps> => {
    const path = '/segments/'+ segment_id + '?type=' + type +  '&aggregation=' + aggregation;
    console.log(path)
    const res = await fetch(path)
    const data = await res.json();
    return data
}