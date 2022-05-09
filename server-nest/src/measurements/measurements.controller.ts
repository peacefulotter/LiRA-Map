import { Controller, Get, Put, Query } from '@nestjs/common';
import { Measurement } from 'src/models';

import { MeasurementsService } from './measurements.service';


@Controller('measurements')
export class MeasurementsController 
{
    constructor(private readonly service: MeasurementsService) {}

    @Get()
    getMeasurements(): Promise<Measurement[]> 
    {
        return this.service.getMeasurements();
    }

    @Put('/add')
    addtMeasurement( @Query() query: { measurement: Measurement } ): Promise<any> 
    {
        const { measurement } = query
        return this.service.addMeasurement(measurement);
    }

    @Put('/edit')
    editMeasurement( @Query() query: { index: number, measurement: Measurement } ): Promise<any> 
    {
        const { index, measurement } = query;
        return this.service.editMeasurement(index, measurement);
    }
}
