
import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';

import { RideMeta } from './models.rides';
import { BoundedPath, PointData } from 'src/models';

@Injectable()
export class RidesService 
{
    constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

    async getRides(): Promise<RideMeta[]>
    {
        return await this.knex
            .select( '*' )
            .from( { public: 'Trips' } )
            .whereNot( 'TaskId', 0 )
            .orderBy('TaskId')
    }

    async getRide( tripId: string, dbName: string ): Promise<BoundedPath>
    {
        console.log(tripId, dbName);
        
        const res = await this.knex
            .select( [ 'message', 'lat', 'lon', 'Created_Date' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': dbName } )
            .whereNot( { 'lat': null, 'lon': null } )

        let minX = Number.MAX_SAFE_INTEGER;
        let maxX = Number.MIN_SAFE_INTEGER;
        let minY = Number.MAX_SAFE_INTEGER;
        let maxY = Number.MIN_SAFE_INTEGER;

        const path = res
            .map( (msg: any) => {
                const json = JSON.parse(msg.message)
                const value = json['obd.rpm.value'];
                const time = new Date(msg.Created_Date).getTime()

                minX = Math.min(minX, time);
                maxX = Math.max(maxX, time);
                minY = Math.min(minY, value)
                maxY = Math.max(maxY, value)

                return { lat: msg.lat, lng: msg.lon, value, metadata: { timestamp: time } } as PointData
            } )
            .sort( (a: PointData, b: PointData) =>
                a.metadata.timestamp - b.metadata.timestamp
            )

        return { path, bounds: { minX, maxX, minY, maxY } }
    }
}
