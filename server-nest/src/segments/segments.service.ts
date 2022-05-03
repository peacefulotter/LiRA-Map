import { Injectable } from '@nestjs/common';
import { json } from 'express';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';
import internal from 'stream';
import { Segment } from './interfaces/segment.interface';

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



    async getSegmentsInAPolygon(pointsList: any):Promise<Segment[]>{
        const pointsString = pointsList[0] + ',' + pointsList[1] + ',' + pointsList[2] + ',' + pointsList[3] + ',' + pointsList[0];
        const makePolygon = "ST_MakePolygon( ST_GeomFromText('LINESTRING(" + pointsString + ")'))"
        return await this.knex.raw('SELECT "Id", "Way", ST_Y("PositionA") as LonA, '
        + 'ST_X("PositionA") as LatA, '
        + 'ST_Y("PositionB") as LonB, ST_X("PositionB") as LatB FROM "Segments" '
        + 'WHERE ST_Contains(' + makePolygon + ', "PositionA")')
            .then(res => {
                const segments = this.parseSegments(res.rows);
                console.log(segments)
                return segments;
            })
    }
}
