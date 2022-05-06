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

    @Get('aggregatedValues/types/:segment_id')
    getAggregatedValuesTypesOfSegment(@Param() params: {segment_id: number}): Promise<string[]>{
        const segment_id = params.segment_id;
        return this.typesService.getAggregatedValuesTypesOfSegment(segment_id);
        
    }

    @Get('aggregatedValues/aggregation/:segment_id')
    getAggregationTypesOfSegment(@Param() params: {segment_id: number}, @Query() query: {type: string}): Promise<string[]>{
        const type = query.type;
        const segment_id = params.segment_id;
        return this.typesService.getAggregationTypesOfSegment(type, segment_id);
    }


}
