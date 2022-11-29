import { Body, Controller, Delete, Get, Logger, Param, Put, Query } from '@nestjs/common';
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

    @Put()
    addtMeasurement( @Body() body: { params: { measurement: Measurement } } ): Promise<any> 
    {
        const { measurement } = body.params;
        Logger.log(measurement);
        return this.service.addMeasurement(measurement);
    }

    @Put('/:measurementID')
    editMeasurement( @Param('measurementID') measurementID: string, @Body() body: { params: { measurement: Measurement } } ): Promise<any> 
    {
        const { measurement } = body.params;
        return this.service.editMeasurement( measurement);
    }

    @Delete(':measurementID')
    deleteMeasurement( @Param('measurementID') measurementID: string ): Promise<any> {
        return this.service.deleteMeasurement(measurementID);
    }

}
