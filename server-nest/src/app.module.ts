import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypesController } from './types/types.controller';
import { TypesService } from './types/types.service';

import { SegmentsController } from './segments/segments.controller';
import { SegmentsService } from './segments/segments.service';

import { RidesController } from './rides/rides.controller';
import { RidesService } from './rides/rides.service';

import { MeasurementsController } from './measurements/measurements.controller';
import { MeasurementsService } from './measurements/measurements.service';

import { RCController } from './conditions/rc.controller';
import { RCService } from './conditions/rc.service';

import { AltitudeController } from './altitude/alt.controller';
import { AltitudeService } from './altitude/alt.service';

import { TagsService } from './tags/tags.service';
import { TagsController } from './tags/tags.controller';

import { MuService } from './mu/mu.service';
import { MuController } from './mu/mu.controller';

import { DeviceService } from './devices/devices.service';
import { DeviceController } from './devices/devices.controller';

import {
  LIRA_DB_CONFIG,
  POSTGIS_DB_CONFIG,
  VISUAL_DB_CONFIG,
} from './database';

/* @author Mads Møller s184443, Martin Nielsen s174971 */

const database = (config: any, name: string) => {
  return KnexModule.forRootAsync(
    {
      useFactory: () => ({
        config,
      }),
    },
    name,
  );
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    database(LIRA_DB_CONFIG, 'lira-main'),
    database(VISUAL_DB_CONFIG, 'lira-vis'),
    database(POSTGIS_DB_CONFIG, 'postgis'),
  ],
  controllers: [
    AppController,
    SegmentsController,
    TypesController,
    RidesController,
    MeasurementsController,
    RCController,
    AltitudeController,
    TagsController,
    MuController,
    DeviceController,
  ],
  providers: [
    AppService,
    SegmentsService,
    ConfigService,
    TypesService,
    RidesService,
    MeasurementsService,
    RCService,
    AltitudeService,
    TagsService,
    MuService,
    DeviceService,
  ],
})
export class AppModule {}
