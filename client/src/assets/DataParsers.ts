import { LatLng, Path, point, Point } from "leaflet";
import { PathProps, RideData,PointData, PathProperties } from "./models";
import { RendererName } from "./renderers";

export const ParseSegments = (data: any): PathProps[] => {
    let segments:PathProps[] = [];
    let rows = data.rows;

    //EXAMPLE OF ROW
    // Id: 1201
    // Length: 0.01520165
    // PositionA: "0101000000BEE4DAABEAD94B40E42032F66F202940"
    // PositionB: "0101000000667D6F78E6D94B40C1AFECDD7A202940"
    // Way: 934286720
    // lata: 55.7024741
    // lona: 12.5633542
    // latb: 55.7024741
    // lonb: 12.5633542

    rows.forEach((row:any) => {
        let pointA:PointData = <PointData>{pos:new LatLng(row.lata, row.lona)}
        let pointB:PointData = <PointData>{pos:new LatLng(row.latb, row.lonb)}
        let rideData:PointData[] = [pointA, pointB];
        let ride:RideData = <RideData>{data:rideData};

        let properties:PathProperties = <PathProperties>{renderer:RendererName.line, color:"#00000", size:1}

        let path:PathProps = <PathProps>{path:ride, properties:properties};

        segments.push(path);
    });

    return segments;
}