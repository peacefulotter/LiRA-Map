
import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';
import { Ways, Node, WaysConditions, Condition, ValueLatLng } from 'src/models';
import groupBy from '../util';

@Injectable()
export class AltitudeService 
{
    constructor(@InjectConnection('postgis') private readonly knex: Knex) {}

    private async getWays(way_ids: string[]): Promise<Ways>
    {
        const ways: any[] = await this.knex()
            .select( this.knex.raw('cast(id as text) as way_id, ST_AsGeoJSON((ST_DumpPoints(geom)).geom)::json->\'coordinates\' as pos, ST_LineLocatePoint(geom, (ST_DumpPoints(geom)).geom) as way_dist') )
            .from( 'way' )  
            .whereIn( 'id', way_ids )

        return groupBy<any, Node>( ways, 'way_id', (cur: any) => (
            { lat: cur.pos[1], lng: cur.pos[0], way_dist: cur.way_dist }
        ) )
    }

    private async getAltitudes(): Promise<{ [key: string]: Condition[]} >
    {
        const altitudes: any[] = await this.knex()
            .select( this.knex.raw('cast(way_id as text), way_dist, altitude') )
            .from( 'altitude' )  
            .limit(200_000)

        return groupBy<any, Condition>( altitudes, 'way_id', (cur: any) => (
            { value: cur.altitude, way_dist: cur.way_dist }
        ) )
    }

    async getHeatAltitudes(): Promise<ValueLatLng[]>
    {
        return await this.knex()
            .select( this.knex.raw('altitude as value, x as lng, y as lat') )
            .from(this.knex.raw('altitude, getCoord(cast(way_id as character varying), way_dist)'))
            .limit(200_000) as any
    }

    async getAltitudesConditions(): Promise<WaysConditions>
    {
        const altitudes = await this.getAltitudes()
        const way_ids = Object.keys(altitudes)
        const ways = await this.getWays(way_ids)

        return way_ids.reduce( 
            (acc, way_id) => {
                acc.way_ids.push(way_id)
                acc.geometry.push(ways[way_id])
                acc.conditions.push(altitudes[way_id])
                return acc
            }, { way_ids: [], geometry: [], conditions: [] } as WaysConditions
        )
    }
}


