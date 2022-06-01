
import { Injectable } from '@nestjs/common';

import { readdir } from 'fs'
import { readFile } from 'fs/promises';
import { InjectConnection, Knex } from 'nestjs-knex';
import { promisify } from 'util';
const readdirAsync = promisify( readdir )

import { RendererName } from '../models';
import axios from 'axios';
import { MapConditions, Way, WayConditions } from './models.rc';

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

    async getWays(roadName: string): Promise<Way[]>
    {
        const ways: any = await this.knex()
            .select( this.knex.raw('id, ST_Length(geom::geography) as length') )
            .from( 'way' )
            .where( { official_ref: roadName } )
            .orderBy( this.knex.raw('id::integer') as any )

        const wayIds = ways.map( (way: any) => way.id )
        
        console.log('Querying Overpass server');
        
        const url = `http://lira-osm.compute.dtu.dk/api/interpreter?data=[out:json];way(id:${wayIds.join(',')});out geom;`
        const res = await axios.get(url)

        const { elements } = res.data

        console.log(wayIds);
        
        console.log(elements.map( elt => elt.id ));
        

        return ways.map( ({id, length}, i: number) => (
            { id: parseInt(id, 10), length, geom: elements[i].geometry }
        ) )
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

    async getZoomConditions(wayIds: number[], type: string, zoom: number): Promise<WayConditions>
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
        const ways: Way[] = await this.getWays(roadName)
        const wayIds = ways.map( way => way.id )

        console.log('Fetching zooms');
        const zooms = await this.getZoomConditions(wayIds, type, zoomLevel) 
        console.log(zooms.length);
        

        const toMapConditions = (way: Way): MapConditions => ({
            way,
            properties: { dbName: 'blob-'+way.id, name: roadName, rendererName: RendererName.hotline },
            conditions: zooms.filter(rc => parseInt(rc.way_id, 10) === way.id)
        })

        return ways
            .map( way => toMapConditions(way) )
            .filter( ({conditions}) => conditions.length > 0 )
    }
}


