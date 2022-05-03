import { LatLng } from "leaflet";
import { parseSegments, parseEnergyData } from "../assets/DataParsers";
import { SegmentProps } from "../Components/CarData/Segment";
import { PopUpInformation } from "../Components/CarData/SegmentPopup";


export const GetSegmentsAndAverageValuesInAPolygon = async (points: LatLng[], type: string, aggregation: string): Promise<SegmentProps[]> => {

    const northEastString = points[0].lat + " " + points[0].lng;
    const southEastString = points[1].lat + " " + points[1].lng;
    const southWestString = points[2].lat + " " + points[2].lng;
    const northWestString = points[3].lat + " " + points[3].lng;

    let path = '/segments/'+ northEastString +';'+ southEastString +';'+ southWestString +';'+ northWestString +
     '?type=' + type +  '&aggregation=' + aggregation;
    console.log(path)
    let res = await fetch(path)
    let data = await res.json();
    return data
}


export const GetEnergyConsumptionDataFromSegment = async (segment: Number): Promise<PopUpInformation> => {

    let path = '/segments/' + segment + '/energy';
    let res = await fetch(path);
    let data = await res.json();
    return parseEnergyData(data);

}