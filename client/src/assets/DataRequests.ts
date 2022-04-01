import { LatLng } from "leaflet";
import { ParseSegments } from "./DataParsers";
import { PathProps, SegmentProps } from "./models";


export const GetSegmentsAndAggregatedDataInAPolygon = async (points: LatLng[], measurementType:String): Promise<SegmentProps[]> => {

    const northEastString = points[0].lat + " " + points[0].lng;
    const southEastString = points[1].lat + " " + points[1].lng;
    const southWestString = points[2].lat + " " + points[2].lng;
    const northWestString = points[3].lat + " " + points[3].lng;

    let path = '/segments/'+ northEastString +';'+ southEastString +';'+ southWestString +';'+ northWestString + '?type=' + measurementType;
    console.log(path)
    let res = await fetch(path)
    let data = await res.json();
    return ParseSegments(data);
}