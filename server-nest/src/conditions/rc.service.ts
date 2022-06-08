
import { Injectable } from '@nestjs/common';

import { readdir } from 'fs'
import { readFile } from 'fs/promises';
import { InjectConnection, Knex } from 'nestjs-knex';
import { promisify } from 'util';
const readdirAsync = promisify( readdir )

import { RendererName } from '../models';
import { MapConditions, WayConditions, Ways, Node } from './models.rc';

@Injectable()
export class RCService 
{
    path: string;

    constructor(@InjectConnection('postgis') private readonly knex: Knex) {
        this.path = './src/conditions/json/'
    }

    async getMLFiles() 
    {
        const files = await readdirAsync( this.path )
        return files.map( file => file.replace('.json', '') )
    }

    async getMLFile(filename: string) 
    {
        const file = await readFile( this.path + filename + '.json', 'utf-8' )
        return JSON.parse(file)
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

        console.log(way_lengths);
        

        return [
            this.groupBy<any, Node>( ways, 'way_id', (cur: any) => ({ lat: cur.pos[1], lng: cur.pos[0], way_dist: cur.way_dist }) ),
            way_lengths.reduce( (acc, cur) => ({ ...acc, [cur.id]: cur.length }), {}),
        ]
    }

    async getWaysRoadConditions(wayIds: number[], type: string): Promise<WayConditions>
    {
        return await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'road_conditions' )
            .where( { 'type': type } )
            .whereIn( 'way_id', wayIds )
            .orderBy( 'way_dist' );
    }

    async getWayRoadConditions(wayId: number, type: string): Promise<WayConditions>
    {
        return await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'road_conditions' )
            .where( { 'type': type, 'way_id': wayId } )
            .orderBy( 'way_dist' );
    }

    async getZoomConditions(wayIds: string[], type: string, zoom: number): Promise<WayConditions>
    {
        return await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'zoom_conditions' )
            .where( { 'type': type, 'zoom': zoom } )
            .whereIn( 'way_id', wayIds )
            .orderBy( 'way_dist' )
    }

    async getWaysConditions(roadName: string, type: string, zoomLevel: number): Promise<MapConditions[]>
    {
        console.log('Fetching ways');
        const [ways, way_lengths] = await this.getWays(roadName)
        console.log(ways);
        console.log(way_lengths);
        
        const wayIds = Array.from(ways.keys())

        console.log(wayIds);
        

        console.log('Fetching zooms');
        const zooms = await this.getZoomConditions(wayIds, type, zoomLevel) 
        console.log(zooms.length);


        return Array.from(ways.entries())
            .map( ([way_id, nodes]) => ({
                way_id,
                way_length: way_lengths[way_id],
                nodes,
                properties: { dbName: way_id, name: roadName, rendererName: RendererName.hotline },
                conditions: zooms.filter(rc => rc.way_id === way_id)
            }))
            .filter( ({conditions}) => conditions.length > 0 )
    }
}


