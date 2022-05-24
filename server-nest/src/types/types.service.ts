import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';


@Injectable()
export class TypesService {
    constructor(@InjectConnection('lira-vis') private readonly knex: Knex){

    }

    async getAggregatedValuesTypes():Promise<[number, string][]>{
        
        return await this.knex.raw('SELECT DISTINCT "computed_values_types"."id", "computed_values_types"."name"' 
        +' FROM "aggregated_values" INNER JOIN "computed_values_types" ON "aggregated_values"."cv_type" = "computed_values_types"."id"')
            .then(res => {
                return res.rows;
            })
    }

    async getAggregationTypes(dataType: number):Promise<[number, string][]>{
       

        return await this.knex.raw('SELECT DISTINCT "aggregation_methods"."id", "aggregation_methods"."name"' 
        +' FROM "aggregated_values" INNER JOIN "aggregation_methods" ON "aggregated_values"."aggregation_method" = "aggregation_methods"."id"'
        +' WHERE "aggregated_values"."cv_type" = ' + dataType)
            .then(res => {
                return res.rows;
            })
    }

    async getAggregatedValuesTypesOfSegment(segment_id: number):Promise<[number, string][]>{
        
        return await this.knex.raw('SELECT DISTINCT "computed_values_types"."id", "computed_values_types"."name"' 
        +' FROM "aggregated_values" INNER JOIN "computed_values_types" ON "aggregated_values"."cv_type" = "computed_values_types"."id"'
        +' WHERE "aggregated_values"."segment" = ' + segment_id)
            .then(res => {
                return res.rows;
            })
    }

    async getAggregationTypesOfSegment(dataType: string, segment_id: number):Promise<[number, string][]>{
       
        let typeString = "'" + dataType + "'";

        return await this.knex.raw('SELECT DISTINCT "aggregation_methods"."id", "aggregation_methods"."name"' 
        +' FROM "aggregated_values" INNER JOIN "aggregation_methods" ON "aggregated_values"."aggregation_method" = "aggregation_methods"."id"'
        +' INNER JOIN "computed_values_types" ON "computed_values_types"."id" = "aggregated_values"."cv_type"'
        +' WHERE "aggregated_values"."segment" = ' + segment_id + ' AND "computed_values_types"."name" = ' + typeString)
            .then(res => {
                return res.rows;
            })
    }


}
