
import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';

import { RideMeta } from './models.rides';

@Injectable()
export class RidesService 
{
    constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

    async getRides(): Promise<RideMeta[]>
    {
        return await this.knex
            .select( '*' )
            .from( { public: 'Trips' } )
            .whereNot( 'TaskId', 0 )
            .orderBy('TaskId')
    }
}
