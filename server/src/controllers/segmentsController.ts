import { any, path } from 'nconf';
import knex, { Knex } from 'knex';
import {DATABASE_CONFIG} from '../database';

class SegmentsController {

    // API ROUTES METHODS

    // get /points
    // This endpoint transforms the set of points into a polygon and assesses which segments are inside that polygon.
    getSegments = async (request: any, response: any) => {
        console.log("[GET /segments]")
        let points = request.params.points;
        const type = request.query.type;
        const typeString = "'"+type+"'"
        points = points.toString();
        points = points.split(";");

        const pointsString = points[0] + ',' + points[1] + ',' + points[2] + ',' + points[3] + ',' + points[0];
        const makePolygon = "ST_MakePolygon( ST_GeomFromText('LINESTRING(" + pointsString + ")'))"

        const builder: Knex<any, unknown[]> = knex(DATABASE_CONFIG);

        // SELECT table1.column1, table2.column2...
        // FROM table1
        // INNER JOIN table2
        // ON table1.common_filed = table2.common_field;


        const res = await builder.raw('SELECT "Segments"."Id", "Segments"."Length", "Segments"."Way", ST_Y("Segments"."PositionA") as LonA, ST_X("Segments"."PositionA") as LatA,'+
         'ST_Y("Segments"."PositionB") as LonB, ST_X("Segments"."PositionB") as LatB, "AggregatedValues"."Average", "AggregatedValues"."Count",' +
         ' "AggregatedValues"."Max", "AggregatedValues"."Min", "AggregatedValues"."Variance" '
         + 'FROM "Segments" INNER JOIN "AggregatedValues" '
         + 'ON "Segments"."Id" = "AggregatedValues"."Segment" '
         + 'WHERE ST_Contains(' + makePolygon + ', "Segments"."PositionA") AND "AggregatedValues"."Type" = ' + typeString);
        response.json(res);
    }
  }

  export default SegmentsController;