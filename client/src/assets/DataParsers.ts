import { LatLng, Path, point, Point } from "leaflet";
import { PathProps, RideData,PointData, PathProperties, SegmentProps } from "./models";
import { RendererName } from "./renderers";

export const ParseSegments = (data: any): SegmentProps[] => {
    let segments:SegmentProps[] = [];
    let rows = data.rows;
    //EXAMPLE OF ROW
    // Average: 160.13115
    // Count: 61
    // Id: 31
    // Length: 0.02968711
    // Max: 164
    // Min: 159
    // Variance: 1.4491804
    // Way: 3546485
    // lata: 55.7024741
    // latb: 55.7024885
    // lona: 12.5633542
    // lonb: 12.5628827

    rows.forEach((row:any) => {
        let pointA:PointData = <PointData>{pos:new LatLng(row.lata, row.lona)}
        let pointB:PointData = <PointData>{pos:new LatLng(row.latb, row.lonb)}
        let rideData:PointData[] = [pointA, pointB];
        let ride:RideData = <RideData>{data:rideData};

        let properties:PathProperties = <PathProperties>{renderer:RendererName.line, color:"#00000", size:4}

        let path:SegmentProps = <SegmentProps>{path:ride, properties:properties, id:row.Id, length: row.Length,
        avg:row.Average, count: row.Count, max: row.Max, min: row.Min, way: row.Way};

        segments.push(path);
    });

    return segments;
}