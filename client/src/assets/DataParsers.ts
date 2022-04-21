import {SegmentProps} from "../models/models";
import {RendererName} from "../models/renderers";
import {PointData, DataPath} from "../models/path";
import { PathProperties } from "../models/properties";
import { PopUpInformation } from "../Components/CarData/SegmentPopup";

export const parseSegments = (data: any): SegmentProps[] => {
    // EXAMPLE OF ROW
    // Count: 18
    // Id: 57615
    // Length: 0.018770253
    // Value: 152.27777
    // Way: 502443899
    // lata: 55.7366596
    // latb: 55.7364914
    // lona: 12.486594
    // lonb: 12.4866143

    return data.rows.map( (row:any) => {
        console.log(row);
        const pointA: PointData = { lat: row.lata, lng: row.lona }
        const pointB: PointData = { lat: row.latb, lng: row.lonb }
        const dataPath: DataPath = { path: [pointA, pointB], minX: 0, maxX: 10, minY: 0, maxY: 10 };
        const properties: PathProperties = { rendererName: RendererName.line, color:"#00000", width: 4 }
        return { 
            dataPath, properties, id: row.Id,
            value: row.Value, count: row.Count, way: row.Way
        };
    });
}


export const parseEnergyData = (data: any): PopUpInformation => {
    // EXAMPLE OF ROW
    //Id: 57800,
    //   Length: 0.061589863,
    //   Way: 167982047,
    //   propertytype: 'hillClimbingForce',
    //   propertyvalue: -646.1707

    let segmentId: Number;
    let segmentWay: Number;
    let segmentLength: Number;
    let segmentAngle: Number = 0;
    let tractionForce: Number = 0;
    let inertialForce: Number = 0;
    let hillClimbingForce: Number = 0;
    
    segmentId = data[0][1].Id;
    segmentWay = data[0][1].Way;
    segmentLength = data[0][1].Length;

    data.forEach((element:any) => {
        let values = element[1];
        switch(values.Type){
            case "hillClimbingForce":
                hillClimbingForce = values.Value;
                break;
            case "inertialForce":
                inertialForce = values.Value;
                break;
            case "theta":
                segmentAngle = values.Value;
                break;
            case "energy":
                tractionForce = values.Value;
                break;
            default:
                break;
        }
        
    });

    const res: PopUpInformation = { segmentId: segmentId, segmentWay: segmentWay, segmentLength: segmentLength,
    segmentAngle: segmentAngle, hillClimbingForce: hillClimbingForce, inertialForce: inertialForce, tractionForce: tractionForce };

    return res;
}