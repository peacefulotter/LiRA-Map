
import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { InjectConnection, Knex } from 'nestjs-knex';
import { MapBounds, MapConditions, Node, WayConditions, Ways } from 'src/models';

@Injectable()
export class RCService 
{
    constructor(@InjectConnection('postgis') private readonly knex: Knex) {
    }

    // const endnodes = elements.map( ({nodes}, i: number) => [nodes[0], nodes[nodes.length - 1], i] )
        
    // let orderedNodes = [endnodes[0]]
    // console.log(elements.map(({nodes}) => nodes));
    
    
    // // FIXME
    // for ( let j = 0; j < endnodes.length; j++ )
    // {
    //     let head = orderedNodes[0]
    //     let tail = orderedNodes[orderedNodes.length - 1]
    //     // console.log(orderedNodes.length, endnodes.length, orderedNodes, head, tail);
        
    //     for ( let i = 0; i < endnodes.length; i++ )
    //     {
    //         const cur = endnodes[i]
    //         if ( cur[0] === tail[1] )
    //         {
    //             orderedNodes.push( cur )
    //         }
    //         else if ( cur[1] === head[0] )
    //         {
    //             orderedNodes.splice(0, 0, cur)
    //         }
    //     }
    // }

    // console.log(orderedNodes);
    
    // const geoms = new Map(
    //     res.data.elements.map( ({id, geometry}) => [id, geometry.map(({lat, lon}) => ({lat, lng: lon}))] )
    // );

    groupBy<T, Q>(arr: T[], key: string, map: (value: T) => Q) {
        return arr.reduce( (acc, cur) => {
            const k = cur[key]
            const v = map(cur)
            acc.get(k)?.push(v) ?? acc.set(k, [v]);
            return acc;
        }, new Map<string, Q[]>());
    }   

    async getWays(roadName: string): Promise<[Ways, Map<string, number>]>
    {
        //         select 
        // 	ST_AsGeoJSON((ST_DumpPoints(geom)).geom)::json->'coordinates' as pos, 
        // 	ST_LineLocatePoint(geom, (ST_DumpPoints(geom)).geom) as way_dist 
        // from way where id='100211823'
        const ways: any[] = await this.knex()
            .select( this.knex.raw('id as way_id, ST_AsGeoJSON((ST_DumpPoints(geom)).geom)::json->\'coordinates\' as pos, ST_LineLocatePoint(geom, (ST_DumpPoints(geom)).geom) as way_dist') )
            .from( 'way' )  
            .where( { official_ref: roadName } )
            .orderBy( this.knex.raw('id::integer') as any )

        const way_lengths: any[] = await this.knex()
            .select( this.knex.raw('id, ST_Length(geom::geography) as length') ) 
            .from( 'way' )
            .where( { official_ref: roadName } )

            .orderBy( this.knex.raw('id::integer') as any )

        return [
            this.groupBy<any, Node>( ways, 'way_id', (cur: any) => ({ lat: cur.pos[1], lng: cur.pos[0], way_dist: cur.way_dist }) ),
            way_lengths.reduce( (acc, {id, length}) => { acc.set(id, length); return acc }, new Map<string, number>()),
        ]
    }

    async getWaysRoadConditions(wayIds: number[], type: string): Promise<Map<string, WayConditions>>
    {
        const res = await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'road_conditions' )
            .where( { 'type': type } )
            .whereIn( 'way_id', wayIds )
            .orderBy( 'way_dist' );
        return this.groupBy( res, 'way_id', ({way_dist, value}) => ({way_dist, value}) )
    }

    async getWayRoadConditions(wayId: number, type: string): Promise<WayConditions>
    {
        return await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'road_conditions' )
            .where( { 'type': type, 'way_id': wayId } )
            .orderBy( 'way_dist' );
    }

    async getZoomConditions(wayIds: string[], type: string, zoom: number): Promise<Map<string, WayConditions>>
    {
        const res = await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'zoom_conditions' )
            .where( { 'type': type, 'zoom': zoom } )
            .whereIn( 'way_id', wayIds )
            .orderBy( 'way_dist' )
        return this.groupBy( res, 'way_id', ({way_dist, value}) => ({way_dist, value}) )
    }

    async getMapConditions(roadName: string, type: string, zoomLevel: number): Promise<MapConditions>
    {
        const [ways, way_lengths] = await this.getWays(roadName)
        const way_ids = Array.from(ways.keys())
        const zooms = await this.getZoomConditions(way_ids, type, zoomLevel)         
        return way_ids.reduce( 
            (acc, way_id) => {
                if (zooms.has(way_id))
                    acc[way_id] = {
                        way_length: way_lengths.get(way_id),
                        nodes: ways.get(way_id),
                        conditions: zooms.get(way_id)
                    }
                return acc
            }, {} as MapConditions
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


