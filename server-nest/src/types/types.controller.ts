import { Controller, Get, Param, Query } from '@nestjs/common';
import { TypesService } from './types.service';

@Controller('types')
export class TypesController {

    constructor(private readonly typesService: TypesService){}

    @Get('aggregatedValues/types')
    getAggregatedValuesTypes(): Promise<string[]>{

        return this.typesService.getAggregatedValuesTypes();
        
    }

    @Get('aggregatedValues/aggregation')
    getAggregationTypes(@Query() query: {type: string}): Promise<string[]>{
        const type = query.type;
        return this.typesService.getAggregationTypes(type);
    }


}
