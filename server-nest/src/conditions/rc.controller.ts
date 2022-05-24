import { Controller, Get, Query } from '@nestjs/common';
import { TripConditions } from './models.rc';
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

    @Get('full')
    getFullConditions( @Query() query: { road: string, type: string, zoom: number } ): Promise<TripConditions> {
        const { road, type, zoom } = query;
        return this.service.getFullConditions(road, type, zoom);
    }

}
