import { Controller, Get } from '@nestjs/common';
import { RidesService } from './rides.service';

import { RideMeta } from './models.rides';

@Controller('rides')
export class RidesController 
{

    constructor(private readonly ridesService: RidesService) {}

    @Get()
    getAggregatedValuesTypes(): Promise<RideMeta[]> {
        return this.ridesService.getRides();
    }
}
