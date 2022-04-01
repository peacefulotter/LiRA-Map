import { PointData, PathProperties, SegmentProps, DataPath, RendererName } from "../models/models";

export const parseSegments = (data: any): SegmentProps[] => {
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

    return data.rows.map( (row:any) => {
        const pointA: PointData = { lat: row.lata, lng: row.lona }
        const pointB: PointData = { lat: row.latb, lng: row.lonb }
        const dataPath: DataPath = { path: [pointA, pointB] };
        const properties: PathProperties = { rendererName: RendererName.line, color:"#00000", width: 4 }
        return { 
            dataPath, properties, id: row.Id, length: row.Length,
            avg: row.Average, count: row.Count, max: row.Max, min: row.Min, way: row.Way
        };
    });
}