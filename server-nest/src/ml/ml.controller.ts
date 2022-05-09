import { Controller, Get, Query } from '@nestjs/common';
import { MLService } from './ml.service';


@Controller('ml')
export class MLController 
{
    constructor(private readonly service: MLService) {}

    @Get('files')
    getMLFiles(): Promise<any> {
        return this.service.getMLFiles();
    }

    @Get('file')
    getMLFile( @Query() query: { filename: string } ): Promise<any> {
        const { filename } = query;
        return this.service.getMLFile(filename);
    }
}
