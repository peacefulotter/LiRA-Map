import { Controller, Get, Query } from '@nestjs/common';
import { Condition, WaysConditions } from 'src/models';
import { RCService } from './rc.service';


@Controller('conditions')
export class RCController 
{
    constructor(private readonly service: RCService) {}

    @Get('ways')
    getWaysConditions( @Query() query: { type: string, zoom: number } ): Promise<WaysConditions> {
        const { type, zoom } = query;
        return this.service.getWaysConditions(type, zoom);
    }

    @Get('way')
    getWayConditions( @Query() query: { wayId: number, type: string } ): Promise<Condition[]> {
        const { wayId, type } = query;
        return this.service.getWayRoadConditions(wayId, type);
    }

}
