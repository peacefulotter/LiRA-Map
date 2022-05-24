import { Injectable } from '@nestjs/common';
import { json } from 'express';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';
import internal from 'stream';
import {Segment, SegmentWithAggregatedValue } from './interfaces/segment.interface';

@Injectable()
export class SegmentsService {
    constructor(@InjectConnection('lira-vis') private readonly knex: Knex){

    }


    parseSegments(rowsList: any): Segment[]{
        let res: Segment[] = [];
        rowsList.forEach(row => {
            let segment = <Segment>{id: row.Id, positionA: [row.lata, row.lona], positionB:[row.latb, row.lonb], way: row.Way};
            res.push(segment);
        });
        return res;
    }


    parseSegmentsWithAggregatedValue(rowsList: any): SegmentWithAggregatedValue[]{
        let res: SegmentWithAggregatedValue[] = [];
        console.log(rowsList[0])
        rowsList.forEach(row => {
            let segmentWithAggregatedValue = <SegmentWithAggregatedValue>{id: row.id, positionA: [row.lata, row.lona], positionB:[row.latb, row.lonb], way: row.way, 
                count: row.count, type: row.cv_name, aggregation: row.aggr_name, value: row.value, direction: row.direction};
            res.push(segmentWithAggregatedValue);
        });
        return res;
    }



    async getSegmentsInAPolygon(pointsList: any):Promise<Segment[]>{
        const pointsString = pointsList[0] + ',' + pointsList[1] + ',' + pointsList[2] + ',' + pointsList[3] + ',' + pointsList[0];
        const makePolygon = "ST_MakePolygon( ST_GeomFromText('LINESTRING(" + pointsString + ")'))"
        return await this.knex.raw('SELECT "id", "way", ST_Y("position_a") as LonA, '
        + 'ST_X("position_a") as LatA, '
        + 'ST_Y("position_b") as LonB, ST_X("position_b") as LatB FROM "segments" '
        + 'WHERE ST_Contains(' + makePolygon + ', "position_a")')
            .then(res => {
                const segments = this.parseSegments(res.rows);
                return segments;
            })
    }

    async getSegmentsInPolygonWithAggregatedValues(pointsList: any, type:string, aggregation: string, direction: number):Promise<SegmentWithAggregatedValue[]>{

        const typeString = "'" + type + "'";
        const aggregationString = "'" + aggregation + "'";

        const pointsString = pointsList[0] + ',' + pointsList[1] + ',' + pointsList[2] + ',' + pointsList[3] + ',' + pointsList[0];
        const makePolygon = "ST_MakePolygon( ST_GeomFromText('LINESTRING(" + pointsString + ")'))"
        return await this.knex.raw('SELECT "segments"."id", "segments"."way", ST_Y("segments"."position_a") as LonA, '
        + 'ST_X("segments"."position_a") as LatA, '
        + 'ST_Y("segments"."position_b") as LonB, ST_X("segments"."position_b") as LatB, '
        + '"aggregated_values"."count", "computed_values_types"."name" as cv_name, "aggregation_methods"."name" as aggr_name, "aggregated_values"."value", "aggregated_values"."direction" '
        + 'FROM "segments" INNER JOIN "aggregated_values" '
        + 'ON "segments"."id" = "aggregated_values"."segment" '
        + 'INNER JOIN "computed_values_types" ON "computed_values_types"."id" = "aggregated_values"."cv_type" '
        + 'INNER JOIN "aggregation_methods" ON "aggregation_methods"."id" = "aggregated_values"."aggregation_method" '
        + 'WHERE "aggregated_values"."direction" = ' + direction + ' AND ST_Contains(' + makePolygon + ', "segments"."position_a") '
        + 'AND "computed_values_types"."name" = ' + typeString + ' AND "aggregation_methods"."name" = ' + aggregationString)
            .then(res => {
                const segments = this.parseSegmentsWithAggregatedValue(res.rows);
                return segments;
            })
    }

    async getSegmentWithAggregatedValue(segment_id: number, type:string, aggregation: string, direction:number):Promise<SegmentWithAggregatedValue[]>{

        const typeString = "'" + type + "'";
        const aggregationString = "'" + aggregation + "'";

        return await this.knex.raw('SELECT "segments"."id", "segments"."way", ST_Y("segments"."position_a") as LonA, '
        + 'ST_X("segments"."position_a") as LatA, '
        + 'ST_Y("segments"."position_b") as LonB, ST_X("segments"."position_b") as LatB, '
        + '"aggregated_values"."count", "computed_values_types"."name" as cv_name, "aggregation_methods"."name" as aggr_name, "aggregated_values"."value", "aggregated_values"."direction" '
        + 'FROM "segments" INNER JOIN "aggregated_values" '
        + 'ON "segments"."id" = "aggregated_values"."segment" '
        + 'INNER JOIN "computed_values_types" ON "computed_values_types"."id" = "aggregated_values"."cv_type" '
        + 'INNER JOIN "aggregation_methods" ON "aggregation_methods"."id" = "aggregated_values"."aggregation_method" '
        + 'WHERE "aggregated_values"."direction" = ' + direction + ' AND "segments"."id" = ' + segment_id
        + ' AND "computed_values_types"."name" = ' + typeString + ' AND "aggregation_methods"."name" = ' + aggregationString)
            .then(res => {
                const segments = this.parseSegmentsWithAggregatedValue(res.rows);
                return segments;
            })
    }
}
