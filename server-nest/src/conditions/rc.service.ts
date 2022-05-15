
import { Injectable } from '@nestjs/common';

import { readdir } from 'fs'
import { readFile } from 'fs/promises';
import { InjectConnection, Knex } from 'nestjs-knex';
import { promisify } from 'util';
const readdirAsync = promisify( readdir )


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

    async getIRIConditions(zoom: number, wayIds: number[]) 
    {
        console.log(wayIds);
        return await this.knex
            .select( [ 'way_id', 'way_dist', 'value', 'zoom' ] )
            .from('zoom_conditions')
            .where( { 'type': "IRI", 'zoom': zoom } )
            .whereIn( 'way_id', wayIds )
            .orderBy( ['way_id', 'way_dist'] );
    }
}
