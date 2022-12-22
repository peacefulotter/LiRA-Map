import { Controller, Get, Query } from '@nestjs/common';

import { Condition, MapBounds, WaysConditions } from 'src/models';
import { RCService } from './rc.service';
  

@Controller('conditions')
export class RCController 
{
    constructor(private readonly service: RCService) {}

    @Get('ways')
    getWaysConditions( @Query() query: { type: string, zoom: string } ): Promise<WaysConditions> {
        const { type, zoom } = query;
        return this.service.getWaysConditions(type, zoom);
    }

    @Get('way')
    getWayConditions( @Query() query: { wayId: string, type: string } ): Promise<Condition[]> {
        const { wayId, type } = query;
        return this.service.getWayRoadConditions(wayId, type);
    }

    @Get('/bounded/ways')
    getBoundedWaysConditions( @Query() query: { minLat: string, maxLat: string, minLng: string, maxLng: string, type: string, zoom: string } ): Promise<any> {
        const { minLat, maxLat, minLng, maxLng, type, zoom } = query;
        const bounds: MapBounds = { 
            minLat: parseFloat(minLat), 
            maxLat: parseFloat(maxLat), 
            minLng: parseFloat(minLng), 
            maxLng: parseFloat(maxLng) 
        }
        return this.service.getBoundedWaysConditions(bounds, type, zoom);
    }

}
