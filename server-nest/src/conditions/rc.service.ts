
import { Injectable } from '@nestjs/common';

import { readdir } from 'fs'
import { readFile } from 'fs/promises';
import { InjectConnection, Knex } from 'nestjs-knex';
import { promisify } from 'util';
const readdirAsync = promisify( readdir )

import { MapWayConditions, RoadConditions, TripConditions, Way  } from './models.rc';
import { RendererName } from '../models';
import axios from 'axios';

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

    async getWays(roadName: string): Promise<Way[]>
    {
        const ways: any = await this.knex()
            .select( this.knex.raw('id, ST_Length(geom::geography) as length') )
            .from( 'way' )
            .where( { official_ref: roadName } )

        const wayIds = ways.map( (way: any) => way.id )
        
        const url = `http://lira-osm.compute.dtu.dk/api/interpreter?data=[out:json];way(id:${wayIds.join(',')});out geom;`
        const res = await axios.get(url)

        const { elements } = res.data
        const endnodes = elements.map( ({nodes}, i: number) => [nodes[0], nodes[nodes.length - 1], i] )
        
        let orderedNodes = [endnodes[0]]
        console.log(elements.map(({nodes}) => nodes));
        
        
        // FIXME
        for ( let j = 0; j < endnodes.length; j++ )
        {
            let head = orderedNodes[0]
            let tail = orderedNodes[orderedNodes.length - 1]
            // console.log(orderedNodes.length, endnodes.length, orderedNodes, head, tail);
            
            for ( let i = 0; i < endnodes.length; i++ )
            {
                const cur = endnodes[i]
                if ( cur[0] === tail[1] )
                {
                    orderedNodes.push( cur )
                }
                else if ( cur[1] === head[0] )
                {
                    orderedNodes.splice(0, 0, cur)
                }
            }
        }

        console.log(orderedNodes);
        
            

        
        const geoms = new Map(
            res.data.elements.map( ({id, geometry}) => [id, geometry.map(({lat, lon}) => ({lat, lng: lon}))] )
        );

        return ways.map( ({id, length}) => ({ id: parseInt(id, 10), length, geom: geoms.get(parseInt(id, 10)) }) )
    }

    async getRoadConditions(wayIds: number[], type: string): Promise<RoadConditions>
    {
        const res = await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'road_conditions' )
            .where( { 'type': type } )
            .whereIn( 'way_id', wayIds )
            .orderBy( 'way_dist' );

        return res.sort( (a, b) => wayIds.indexOf(a.way_id) - wayIds.indexOf(b.way_id) )
    }

    async getZoomConditions(wayIds: number[], type: string, zoom: number): Promise<RoadConditions>
    {
        const res = await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'zoom_conditions' )
            .where( { 'type': type, 'zoom': zoom } )
            .whereIn( 'way_id', wayIds )
            .orderBy( 'way_dist' )

        return res.sort( (a, b) => wayIds.indexOf(a.way_id) - wayIds.indexOf(b.way_id) )
    }

    async getFullConditions(roadName: string, type: string, zoomLevel: number): Promise<TripConditions>
    {
        // const wayIds: number[] = [5056416,358202922,358202917,273215212,117882081,24449371,5056434,205390176,205390170,2860952,23474957,729386233,35221934,35913117,878636806,878636808,26361334,38154645,38072846,527276167,527276166,30219634,25949335,25949338,205636596,9512945,85205854,219657886,263681425,263681427,219657881,263276626,271780210,25075330,5056369,5056367,5056375,5056380,5056381,5056366,219657806,219657811,23000641,98479074,98479020,23000640,29057944]
        const ways = await this.getWays(roadName)
        console.log(ways);
        
        const wayIds = ways.map( way => way.id )

        const roadCond = await this.getRoadConditions(wayIds, type)
        const zoom = await this.getZoomConditions(wayIds, type, zoomLevel) 

        const road: MapWayConditions = {
            properties: { dbName: 'blob', name: roadName, rendererName: RendererName.hotline },
            path: roadCond
        }

        return { ways, road, zoom }
    }
}


