
import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { InjectConnection, Knex } from 'nestjs-knex';
import { BoundedCondition, Condition, MapBounds, Node, WayId, WaysConditions } from 'src/models';
import groupBy from '../util';
import { RoadConditions, Ways, ZoomConditions } from '../tables';

@Injectable()
export class RCService 
{
    constructor(@InjectConnection('postgis') private readonly knex: Knex) {}  

    async getWays(wayIds: string[]): Promise<[{[key: WayId]: Node[]}, {[key: WayId]: number}]>
    {
        
        const ways = await Ways(this.knex)
            .select( 
                'id as way_id', 
                this.knex.raw('ST_AsGeoJSON((ST_DumpPoints(geom)).geom)::json->\'coordinates\' as pos'), 
                this.knex.raw('ST_LineLocatePoint(geom, (ST_DumpPoints(geom)).geom) as way_dist'),
                this.knex.raw('ST_Length(geom::geography) as length') 
            )
            .whereIn( 'id', wayIds )
            .orderBy( this.knex.raw('id::integer') as any )

        return [
            groupBy<any, Node>( ways, 'way_id', (cur: any) => ({ lat: cur.pos[1], lng: cur.pos[0], way_dist: cur.way_dist }) ),
            ways.reduce( (acc, cur) => { acc[cur.way_id] = cur.length; return acc }, {} )
        ]
    }

    async getWaysRoadConditions(wayIds: number[], type: string): Promise<{[key: WayId]: Condition[]}>
    {
        const res = await RoadConditions(this.knex)
            .select( 'way_id', 'way_dist', 'value' )
            .where( 'type', type )
            .whereIn( 'way_id', wayIds )
            .orderBy( 'way_dist' );
        return groupBy( res, 'way_id', ({way_dist, value}) => ({way_dist, value}) )
    }

    async getWayRoadConditions(way_id: string, type: string): Promise<Condition[]>
    {
        return await RoadConditions(this.knex)
            .select( 'way_id', 'way_dist', 'value' )
            .where( { 'type': type, 'way_id': way_id } )
            .orderBy( 'way_dist' );
    }

    async getZoomConditions(type: string, zoom: string): Promise<{[key: WayId]: Condition[]}>
    {
        const res = await ZoomConditions(this.knex)
            .select( 'way_id', 'way_dist', 'value' )
            .where( { 'type': type, 'zoom': parseInt(zoom, 10) } )
            .orderBy( 'way_dist' )
        return groupBy( res, 'way_id', ({way_dist, value}) => ({way_dist, value}) )
    }

    async getWaysConditions(type: string, zoom: string): Promise<WaysConditions>
    {
        const zoomConditions = await this.getZoomConditions(type, zoom) 
        const wayIds = Object.keys(zoomConditions)
        const [ways, way_lengths] = await this.getWays(wayIds)

        return wayIds.reduce( 
            (acc, way_id) => {
                {
                    acc.way_ids.push(way_id)
                    acc.way_lengths.push(way_lengths[way_id])
                    acc.geometry.push(ways[way_id])
                    acc.conditions.push(zoomConditions[way_id])
                }
                return acc
            }, { way_ids: [], way_lengths: [], geometry: [], conditions: [] } as WaysConditions
        )
    }


    async getBoundedWaysConditions(bounds: MapBounds, type: string, zoom: string)
    {
        const { minLat, maxLat, minLng, maxLng } = bounds;
        const url = `http://20.93.26.82/rdCondition/getbyframe/minLon/${minLng}/minLat/${minLat}/maxLon/${maxLng}/maxLat/${maxLat}/zoom/${zoom}`
        const res = await axios.get<{[key: WayId]: BoundedCondition}>( url, { params : { type } } )
        console.log(res.data);
        console.log(res.data['205636596']);
        
        return res.data;
    }
}


