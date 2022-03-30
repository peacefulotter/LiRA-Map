import { LatLng } from "leaflet";
import { ParseSegments } from "./DataParsers";
import { PathProps } from "./models";


export const GetSegmentsInAPolygon = async (points: LatLng[]): Promise<PathProps[]> => {

    const northEastString = points[0].lat + " " + points[0].lng;
    const southEastString = points[1].lat + " " + points[1].lng;
    const southWestString = points[2].lat + " " + points[2].lng;
    const northWestString = points[3].lat + " " + points[3].lng;

    let path = '/segments/'+ northEastString +';'+ southEastString +';'+ southWestString +';'+ northWestString;

    let res = await fetch(path)
    .then(res => {return res.json()})
    .then(data => {
        return ParseSegments(data);
    });
    return res;
}