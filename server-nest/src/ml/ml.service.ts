
import { Injectable } from '@nestjs/common';

import { readdir } from 'fs'
import { readFile } from 'fs/promises';
import { promisify } from 'util';
const readdirAsync = promisify( readdir )


@Injectable()
export class MLService 
{
    path: string;

    constructor() {
        this.path = './src/ml/json/'
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
}
