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
        points = points.toString();
        points = points.split(";");

        const pointsString = points[0] + ',' + points[1] + ',' + points[2] + ',' + points[3] + ',' + points[0];
        const makePolygon = "ST_MakePolygon( ST_GeomFromText('LINESTRING(" + pointsString + ")'))"

        const builder: Knex<any, unknown[]> = knex(DATABASE_CONFIG);

        const res = await builder.raw('SELECT *, ST_Y("PositionA") as LonA, ST_X("PositionA") as LatA,'+
         'ST_Y("PositionB") as LonB, ST_X("PositionB") as LatB FROM "Segments" WHERE ST_Contains(' + makePolygon + ', "PositionA")');
        response.json(res);
    }
  }

  export default SegmentsController;