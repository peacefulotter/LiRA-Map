import { Controller, Get, Query } from '@nestjs/common';
import { MapConditions, WayConditions } from './models.rc';
import { RCService } from './rc.service';


@Controller('conditions')
export class RCController 
{
    constructor(private readonly service: RCService) {}

    @Get('files')
    getMLFiles(): Promise<any> {
        return this.service.getMLFiles();
    }

    @Get('file')
    getMLFile( @Query() query: { filename: string } ): Promise<any> {
        const { filename } = query;
        return this.service.getMLFile(filename);
    }

    @Get('ways')
    getWaysConditions( @Query() query: { road: string, type: string, zoom: number } ): Promise<MapConditions[]> {
        const { road, type, zoom } = query;
        return this.service.getWaysConditions(road, type, zoom);
    }

    @Get('way')
    getWayConditions( @Query() query: { wayId: number, type: string } ): Promise<WayConditions> {
        const { wayId, type } = query;
        return this.service.getWayRoadConditions(wayId, type);
    }

}
