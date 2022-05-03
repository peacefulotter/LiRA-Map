import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SegmentsController } from './segments/segments.controller';
import { SegmentsService } from './segments/segments.service';
import { KnexModule } from 'nestjs-knex';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot(), 
    KnexModule.forRootAsync(
    {
      useFactory: () => ({
        config: {
          client: 'pg',
          useNullAsDefault: true,
          connection: {
            host: 'liradb.compute.dtu.dk',
            user: process.env.DB_USER,
            port: 3306,
            password: process.env.DB_PASSWORD,
            database: 'postgres',
          },
          pool: {
            min: 2,
            max: 10,
          },
          log: {
            warn(msg: any) { console.log('warning', msg); },
            error(msg: any) { console.log('error', msg); },
            deprecate(msg: any) { console.log('deprecate', msg); },
            debug(msg: any) { console.log('debug', msg); },
          }
        },
      }),
    },
    'lira-main',
  ),
  KnexModule.forRootAsync(
    {
      useFactory: () => ({
        config: {
          client: 'pg',
          debug:true,
          useNullAsDefault: true,
          connection: {
            host: 'liravisualization.postgres.database.azure.com',
            user: process.env.DB_USER_VIS,
            port: 5432,
            password: process.env.DB_PASSWORD_VIS,
            database: 'postgres',
            ssl:true
          },
          pool: {
            min: 2,
            max: 10,
          },
          log: {
            warn(msg: any) { console.log('warning', msg); },
            error(msg: any) { console.log('error', msg); },
            deprecate(msg: any) { console.log('deprecate', msg); },
            debug(msg: any) { console.log('debug', msg); },
          }
        },
      }),
    },
    'lira-vis',
  ),],
  controllers: [AppController, SegmentsController],
  providers: [AppService, SegmentsService, ConfigService],
})
export class AppModule {}
