import {RendererName} from "../models/renderers";
import {PointData} from "../models/path";
import { BoundedPath} from "../models/path";
import { PathProperties } from "../models/properties";
import { SegmentProps } from "../Components/CarData/Segment";

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
        const bPath: BoundedPath = { path: [pointA, pointB], bounds: { minX: 0, maxX: 10, minY: 0, maxY: 10 } };
        const properties: PathProperties = { rendererName: RendererName.line, color:"#00000", width: 4 }
        return { 
            bPath, properties, id: row.Id, length: row.Length,
            avg: row.Average, count: row.Count, max: row.Max, min: row.Min, way: row.Way
        };
    });
}


