import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';


@Injectable()
export class TypesService {
    constructor(@InjectConnection('lira-vis') private readonly knex: Knex){

    }

    async getAggregatedValuesTypes():Promise<string[]>{
        
        return await this.knex.raw('SELECT DISTINCT "Type" FROM "AggregatedValues"')
            .then(res => {
                return res.rows;
            })
    }

    async getAggregationTypes(dataType: string):Promise<string[]>{
       
        let typeString = "'" + dataType + "'";

        return await this.knex.raw('SELECT DISTINCT "Aggregation" FROM "AggregatedValues" WHERE "Type" = ' + typeString)
            .then(res => {
                return res.rows;
            })
    }


}
