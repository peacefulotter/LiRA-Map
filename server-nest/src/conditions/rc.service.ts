
import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { InjectConnection, Knex } from 'nestjs-knex';
import { Condition, Node, Ways, WaysConditions } from 'src/models';
import groupBy from '../util';

@Injectable()
export class RCService 
{
    constructor(@InjectConnection('postgis') private readonly knex: Knex) {}  

    async getWays(wayIds: string[]): Promise<[Ways, {[key: string]: number}]>
    {
        const ways: any[] = await this.knex()
            .select( this.knex.raw('id as way_id, ST_AsGeoJSON((ST_DumpPoints(geom)).geom)::json->\'coordinates\' as pos, ST_LineLocatePoint(geom, (ST_DumpPoints(geom)).geom) as way_dist') )
            .from( 'way' )  
            .whereIn( 'id', wayIds )
            .orderBy( this.knex.raw('id::integer') as any )

        const way_lengths: any[] = await this.knex()
            .select( this.knex.raw('id, ST_Length(geom::geography) as length') ) 
            .from( 'way' )
            .whereIn( 'id', wayIds )
            .orderBy( this.knex.raw('id::integer') as any )

        return [
            groupBy<any, Node>( ways, 'way_id', (cur: any) => ({ lat: cur.pos[1], lng: cur.pos[0], way_dist: cur.way_dist }) ),
            way_lengths.reduce( (acc, cur) => { acc[cur.id] = cur.length; return acc }, {} )
        ]
    }

    async getWaysRoadConditions(wayIds: number[], type: string): Promise<{[key: string]: Condition[]}>
    {
        const res = await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'road_conditions' )
            .where( { 'type': type } )
            .whereIn( 'way_id', wayIds )
            .orderBy( 'way_dist' );
        return groupBy( res, 'way_id', ({way_dist, value}) => ({way_dist, value}) )
    }

    async getWayRoadConditions(wayId: number, type: string): Promise<Condition[]>
    {
        return await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'road_conditions' )
            .where( { 'type': type, 'way_id': wayId } )
            .orderBy( 'way_dist' );
    }

    async getZoomConditions(type: string, zoom: number): Promise<{[key: string]: Condition[]}>
    {
        const res = await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'zoom_conditions' )
            .where( { 'type': type, 'zoom': zoom } )
            .orderBy( 'way_dist' )
        return groupBy( res, 'way_id', ({way_dist, value}) => ({way_dist, value}) )
    }

    async getWaysConditions(type: string, zoomLevel: number): Promise<WaysConditions>
    {
        const zooms = await this.getZoomConditions(type, zoomLevel) 
        const wayIds = Object.keys(zooms)
        const [ways, way_lengths] = await this.getWays(wayIds)

        return wayIds.reduce( 
            (acc, way_id) => {
                {
                    acc.way_ids.push(way_id)
                    acc.way_lengths.push(way_lengths[way_id])
                    acc.geometry.push(ways[way_id])
                    acc.conditions.push(zooms[way_id])
                }
                return acc
            }, { way_ids: [], way_lengths: [], geometry: [], conditions: [] } as WaysConditions
        )
    }

    // async getMapConditions( bounds: MapBounds, zoom: number ): Promise<MapConditions> 
    // {
    //     const url = 'http://20.67.161.99/rdcondition/getbyframe/zoom'
    //     const res = await axios.get<MapConditions>( url, { params: { ...bounds, zoom } } )
    //     console.log(res.data);
    //     return res.data;
    // }
}


