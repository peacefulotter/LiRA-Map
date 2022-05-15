import { Controller, Get, Query } from '@nestjs/common';
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

    @Get('iri')
    getIRIConditions( @Query() query: { zoom: number, wayIds: number[] } ): Promise<any> {
        const { zoom, wayIds } = query;
        return this.service.getIRIConditions(zoom, wayIds);
    }

}
