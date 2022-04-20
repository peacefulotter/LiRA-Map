import knex, { Knex } from 'knex';
import { DataPath } from '../models';

class SegmentsController {

    getSegments = async ( db: Knex<any, unknown[]>, [points, type]: [string, string] ): Promise<DataPath> => {
        const typeString = "'"+type+"'"
        const pointsList = points.split(";");

        const pointsString = pointsList[0] + ',' + pointsList[1] + ',' + pointsList[2] + ',' + pointsList[3] + ',' + pointsList[0];
        const makePolygon = "ST_MakePolygon( ST_GeomFromText('LINESTRING(" + pointsString + ")'))"
        const res = await db.raw('SELECT "Segments"."Id", "Segments"."Length", "Segments"."Way", ST_Y("Segments"."PositionA") as LonA, ST_X("Segments"."PositionA") as LatA,'+
        'ST_Y("Segments"."PositionB") as LonB, ST_X("Segments"."PositionB") as LatB, "AggregatedValues"."Average", "AggregatedValues"."Count",' +
        ' "AggregatedValues"."Max", "AggregatedValues"."Min", "AggregatedValues"."Variance" '
        + 'FROM "Segments" INNER JOIN "AggregatedValues" '
        + 'ON "Segments"."Id" = "AggregatedValues"."Segment" '
        + 'WHERE ST_Contains(' + makePolygon + ', "Segments"."PositionA") AND "AggregatedValues"."Type" = ' + typeString);
       return res;
    }

    // get /points
    // This endpoint transforms the set of points into a polygon and assesses which segments are inside that polygon.
    // getSegments = async (request: any, response: any) => {
    //     let points = request.params.points;
    //     const type = request.query.type;

    //     throw new Error('DATABASE_CONFIG NOT EXPORTED FROM database.ts ANYMORE\n\t=> Change this file so that it\'s generic (using databaseQuery() for instance)')
    //     const DATABASE_CONFIG = {}
    //     const builder: Knex<any, unknown[]> = knex(DATABASE_CONFIG);

    //     // SELECT table1.column1, table2.column2...
    //     // FROM table1
    //     // INNER JOIN table2
    //     // ON table1.common_filed = table2.common_field;



    // }
  }

  export default SegmentsController;