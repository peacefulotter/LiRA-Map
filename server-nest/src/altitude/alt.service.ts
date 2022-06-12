
import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';
import { MapConditions, Ways, Node, WayConditions, ConditionPoint } from 'src/models';

@Injectable()
export class AltitudeService 
{
    constructor(@InjectConnection('postgis') private readonly knex: Knex) {}

    groupBy<T, Q>(arr: T[], key: string, map: (value: T) => Q) {
        return arr.reduce( (acc, cur) => {
            const k = cur[key]
            const v = map(cur)
            acc.get(k)?.push(v) ?? acc.set(k, [v]);
            return acc;
        }, new Map<string, Q[]>());
    }   

    private async getWays(way_ids: string[]): Promise<Ways>
    {
        const ways: any[] = await this.knex()
            .select( this.knex.raw('cast(id as text) as way_id, ST_AsGeoJSON((ST_DumpPoints(geom)).geom)::json->\'coordinates\' as pos, ST_LineLocatePoint(geom, (ST_DumpPoints(geom)).geom) as way_dist') )
            .from( 'way' )  
            .whereIn( 'id', way_ids )

        return this.groupBy<any, Node>( ways, 'way_id', (cur: any) => (
            { lat: cur.pos[1], lng: cur.pos[0], way_dist: cur.way_dist }
        ) )
    }

    private async getAltitudes(): Promise<Map<string, WayConditions>>
    {
        const altitudes: any[] = await this.knex()
            .select( this.knex.raw('cast(way_id as text), way_dist, altitude') )
            .from( 'altitude' )  

        return this.groupBy<any, ConditionPoint>( altitudes, 'way_id', (cur: any) => (
            { value: cur.altitude, way_dist: cur.way_dist }
        ) )
    }

    async getAltitudesConditions(): Promise<MapConditions>
    {
        const altitudes = await this.getAltitudes()
        const way_ids = Array.from(altitudes.keys())
        const ways = await this.getWays(way_ids)

        return way_ids.reduce( 
            (acc, way_id) => {
                acc[way_id] = {
                    nodes: ways.get(way_id),
                    conditions: altitudes.get(way_id)
                }
                return acc
            }, {} as MapConditions
        )
    }
}


