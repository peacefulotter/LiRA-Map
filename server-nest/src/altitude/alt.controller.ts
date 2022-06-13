import { Controller, Get } from '@nestjs/common';
import { MapConditions, ValueLatLng } from 'src/models';
import { AltitudeService } from './alt.service';


@Controller('altitude')
export class AltitudeController 
{
    constructor(private readonly service: AltitudeService) {}

    @Get('/')
    getAltitudes(): Promise<MapConditions> {
        return this.service.getAltitudesConditions();
    }

    @Get('/heat')
    getHeatAltitudes(): Promise<ValueLatLng[]> {
        console.log('here');
        return this.service.getHeatAltitudes();
    }

}
