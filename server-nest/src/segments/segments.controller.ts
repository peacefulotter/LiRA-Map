import { Controller, Get, Param, Inject, Query } from '@nestjs/common';
import { SegmentsService } from './segments.service';
import {ConfigService } from '@nestjs/config';
import { Segment, SegmentWithAggregatedValue } from './interfaces/segment.interface';

@Controller('segments')
export class SegmentsController {

    @Inject(ConfigService)
    public config: ConfigService;


    constructor(private readonly segmentsService: SegmentsService){}


    @Get(':points')
    getSegmentsInPolygon(@Param() params, @Query() query: { type: string, aggregation: string }): Promise<SegmentWithAggregatedValue[]>{
        const pointsList = params.points.split(";")
        const type = query.type;
        const aggregation = query.aggregation;
        return this.segmentsService.getSegmentsInPolygonWithAggregatedValues(pointsList, type, aggregation);
        
    }



}
