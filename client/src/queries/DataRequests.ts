import { LatLng } from "leaflet";
import { parseSegments} from "../assets/DataParsers";
import { SegmentProps } from "../Components/CarData/Segment";


export const GetSegmentsAndAverageValuesInAPolygon = async (points: LatLng[], type: string, aggregation: string, direction:number): Promise<SegmentProps[]> => {

    const northEastString = points[0].lat + " " + points[0].lng;
    const southEastString = points[1].lat + " " + points[1].lng;
    const southWestString = points[2].lat + " " + points[2].lng;
    const northWestString = points[3].lat + " " + points[3].lng;

    let path = '/segments/polygon/'+ northEastString +';'+ southEastString +';'+ southWestString +';'+ northWestString +
     '?type=' + type +  '&aggregation=' + aggregation +  '&direction=' + direction;
    console.log(path)
    let res = await fetch(path)
    let data = await res.json();
    return data
}


export const GetDataTypes = async (): Promise<string[]> => {
    let path = '/types/aggregatedValues/types'
    let res = await fetch(path);
    let data = await res.json();

    let stringArray:string[] = [];
    data.forEach((element:any) => {
        stringArray.push(element.Type);
    });

    return stringArray;
}

export const GetAggregationTypes = async (dataType: string): Promise<string[]> => {
    let path = '/types/aggregatedValues/aggregation' + '?type=' + dataType;
    let res = await fetch(path);
    let data = await res.json();
    let stringArray:string[] = [];
    data.forEach((element:any) => {
        stringArray.push(element.Aggregation);
    });

    return stringArray;
}

export const GetDataTypesOfSegment = async (segment_id: number): Promise<string[]> => {
    let path = '/types/aggregatedValues/types/' + segment_id;
    let res = await fetch(path);
    let data = await res.json();

    let stringArray:string[] = [];
    data.forEach((element:any) => {
        stringArray.push(element.Type);
    });

    return stringArray;
}

export const GetAggregationTypesOfSegment = async (dataType: string, segment_id: number): Promise<string[]> => {
    let path = '/types/aggregatedValues/aggregation/' + segment_id + '?type=' + dataType;
    let res = await fetch(path);
    let data = await res.json();
    let stringArray:string[] = [];
    data.forEach((element:any) => {
        stringArray.push(element.Aggregation);
    });

    return stringArray;
}


export const GetSegmentAndAggregateValue = async (type: string, aggregation: string, segment_id: number): Promise<SegmentProps> => {

    let path = '/segments/'+ segment_id + '?type=' + type +  '&aggregation=' + aggregation;
    console.log(path)
    let res = await fetch(path)
    let data = await res.json();
    return data
}