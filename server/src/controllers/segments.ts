import knex, { Knex } from 'knex';
import { type } from 'os';
import { DataPath } from '../models';

class SegmentsController {

    getSegments = async ( db: Knex<any, unknown[]>, [points, type]: [string, string] ): Promise<DataPath> => {
        const typeString = "'"+type+"'"
        const pointsList = points.split(";");

        const pointsString = pointsList[0] + ',' + pointsList[1] + ',' + pointsList[2] + ',' + pointsList[3] + ',' + pointsList[0];
        const makePolygon = "ST_MakePolygon( ST_GeomFromText('LINESTRING(" + pointsString + ")'))"
        const res = await db.raw(
        'SELECT "Segments"."Id", "Segments"."Length", "Segments"."Way", ST_Y("Segments"."PositionA") as LonA, '
        + 'ST_X("Segments"."PositionA") as LatA, '
        + 'ST_Y("Segments"."PositionB") as LonB, ST_X("Segments"."PositionB") as LatB, "AggregatedValues"."Value", "AggregatedValues"."Count" '
        + 'FROM "Segments" INNER JOIN "AggregatedValues" '
        + 'ON "Segments"."Id" = "AggregatedValues"."Segment" '
        + 'WHERE ST_Contains(' + makePolygon + ', "Segments"."PositionA") AND "AggregatedValues"."Type" = ' + typeString);
       return res;
    }


    getEnergyDataFromSegment = async (db: Knex<any, unknown[]>, [segmentId]: [number]): Promise<any> => {

      const aggregatedTypesString = "'energy', 'inertialForce'";
      const computedTypesString = "'theta', 'hillClimbingForce'";
      const aggregatedMethodString = "'average'"

      const query1 = 'SELECT "Segments"."Id", "Segments"."Length", "Segments"."Way", '
      + '"AggregatedValues"."Type", '
      + '"AggregatedValues"."Value" '
      + 'FROM "Segments" INNER JOIN "AggregatedValues" '
      + 'ON "Segments"."Id" = "AggregatedValues"."Segment" '
      + 'WHERE "Segments"."Id" = ' + segmentId + ' AND ("AggregatedValues"."Type" IN (' + aggregatedTypesString + ') AND "AggregatedValues"."Aggregation" = ' + aggregatedMethodString + ')';

      const query2 = 'SELECT "Segments"."Id", "Segments"."Length", "Segments"."Way", '
      + '"SegmentProperties"."Type", '
      + '"SegmentProperties"."Value" '
      + 'FROM "Segments" INNER JOIN "SegmentProperties" '
      + 'ON "Segments"."Id" = "SegmentProperties"."Segment" '
      + 'WHERE "Segments"."Id" = ' + segmentId + ' AND "SegmentProperties"."Type" IN (' + computedTypesString + ')'

      const res1 = await db.raw(query1);
      const res2 = await db.raw(query2);
      const res = Object.entries(res1.rows).concat(Object.entries(res2.rows));
      return res;
    }
  }

  export default SegmentsController;