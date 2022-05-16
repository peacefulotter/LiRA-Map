
import { Injectable } from '@nestjs/common';

import { readdir } from 'fs'
import { readFile } from 'fs/promises';
import { InjectConnection, Knex } from 'nestjs-knex';
import { promisify } from 'util';
const readdirAsync = promisify( readdir )

import axios from 'axios'
import { LatLon, Way } from './models.rc';
import { LatLng } from 'src/models';

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

    async getWays(wayIds: number[])
    {
        const url = `http://lira-osm.compute.dtu.dk/api/interpreter?data=[out:json];way(id:${wayIds.join(',')});out%20geom;`
        const res = await axios.get(url)
        console.log(wayIds);

        const getSegmentLength = (seg1: LatLon, seg2: LatLon) => {
            const lat1 = seg1.lat;
            const lon1 = seg1.lon;
            const lat2 = seg2.lat;
            const lon2 = seg2.lon;

            const toRad = (deg: number) => deg * Math.PI / 180

            const φ1 = toRad(lat1);
            const φ2 = toRad(lat2);
            const Δφ = toRad(lat2 - lat1)
            const Δλ = toRad(lon2 - lon1)
            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return 6371e3 * c; // in metres
        }

        const getWayLength = (nodes: LatLon[]) => nodes.reduce( (prev, next) => {
            return [ 
                prev[1] === undefined ? 0 : prev[0] + getSegmentLength(prev[1], next), 
                next
            ]
        }, [0, undefined] as [number, LatLon | undefined] )[0]

        return res.data.elements
            .map( (way: any) => {
                return { 
                    way_id: way.id, 
                    geometry: way.geometry.map( (node: LatLon) => { return { lat: node.lat, lng: node.lon } }), 
                    length: getWayLength(way.geometry) 
                }
            } )
            .sort( (a: Way, b: Way) => {
                return wayIds.indexOf(a.way_id) - wayIds.indexOf(b.way_id)
            })
    }

    async getRoadConditions(wayIds: number[], type: string) 
    {
        return await this.knex
            .select( [ 'way_id', 'way_dist', 'value' ] )
            .from( 'road_conditions' )
            .where( { 'type': type } )
            .whereIn( 'way_id', wayIds )
            .orderBy( ['way_id', 'way_dist'] );
    }

    async getZoomConditions(wayIds: number[], type: string, zoom: number)
    {
        return await this.knex
            .select( [ 'way_id', 'way_dist', 'value', 'zoom' ] )
            .from( 'zoom_conditions' )
            .where( { 'type': type, 'zoom': zoom } )
            .whereIn( 'way_id', wayIds )
            .orderBy( ['way_id', 'way_dist'] );
    }

    async getFullConditions(wayIds: number[], type: string, zoom: number)
    {
        const ways = await this.getWays(wayIds)
        const roadCond = await this.getRoadConditions(wayIds, type)
        const zoomCond = await this.getZoomConditions(wayIds, type, zoom) 


        const waySort = (arr: any[]) => arr
            .sort( (a, b) => a.way_dist - b.way_dist )
            .sort( (a, b) => wayIds.indexOf(a.way_id) - wayIds.indexOf(b.way_id) )

        return {
            "ways": ways,
            "road": waySort(roadCond),
            "zoom": waySort(zoomCond)
        }
    }
}
