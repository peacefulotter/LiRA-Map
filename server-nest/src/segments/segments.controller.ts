import { Controller, Get, Param, Inject } from '@nestjs/common';
import { SegmentsService } from './segments.service';
import {ConfigService } from '@nestjs/config';
import { Segment } from './interfaces/segment.interface';

@Controller('segments')
export class SegmentsController {

    @Inject(ConfigService)
    public config: ConfigService;


    constructor(private readonly segmentsService: SegmentsService){}


    @Get(':points')
    getSegmentsInPolygon(@Param() params): Promise<Segment[]>{
        const pointsList = params.points.split(";")
        return this.segmentsService.getSegmentsInAPolygon(pointsList);
    }


}
