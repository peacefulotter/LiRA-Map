import { Controller, Get, Query } from '@nestjs/common';
import { MapConditions, WayConditions } from 'src/models';
import { RCService } from './rc.service';


@Controller('conditions')
export class RCController 
{
    constructor(private readonly service: RCService) {}

    @Get('ways')
    getMapConditions( @Query() query: { road: string, type: string, zoom: number } ): Promise<MapConditions> {
        const { road, type, zoom } = query;
        return this.service.getMapConditions(road, type, zoom);
    }

    @Get('way')
    getWayConditions( @Query() query: { wayId: number, type: string } ): Promise<WayConditions> {
        const { wayId, type } = query;
        return this.service.getWayRoadConditions(wayId, type);
    }

}
