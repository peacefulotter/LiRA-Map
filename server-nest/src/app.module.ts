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

import { MLController } from './ml/ml.controller';
import { MLService } from './ml/ml.service';

import { LIRA_DB_CONFIG, VISUAL_DB_CONFIG } from './database';


@Module( {
	imports: [
		ConfigModule.forRoot(), 

		KnexModule.forRootAsync( {
			useFactory: () => ( {
				config: LIRA_DB_CONFIG,
			} ),
		}, 'lira-main' ),

		KnexModule.forRootAsync( {
			useFactory: () => ( {
				config: VISUAL_DB_CONFIG,
			} ),
		}, 'lira-vis' ),
	],
	controllers: [AppController, SegmentsController, TypesController, RidesController, MeasurementsController, MLController],
	providers: [AppService, SegmentsService, ConfigService, TypesService, RidesService, MeasurementsService, MLService],
} )

export class AppModule {}
