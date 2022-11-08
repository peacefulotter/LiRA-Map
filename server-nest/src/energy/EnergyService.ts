import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';
import { RideMeta } from '../rides/models.rides';
import {
  AccelerationMessage,
  MeasurementEntity,
  Message,
  SpeedMessage,
  Test,
} from './EnergyInterfaces';
import { Measurement } from '../models';
import * as Console from "console";

@Injectable()
export class EnergyService {
  constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

  private readonly accKey = 'acc.xyz';
  private readonly spdKey = 'obd.spd_veh';
  private readonly consKey = 'obd.trac_cons';

  public async get(tripId: string): Promise<any> {
    const relevantMeasurements: MeasurementEntity[] = await this.knex
      .select('*')
      .from({ public: 'Measurements' })
      .where('FK_Trip', tripId)
      .whereIn('T', [this.accKey, this.spdKey, this.consKey])
      .orderBy('Created_Date')
      .limit(30);

    // For intial testing.
    return await this.collect(relevantMeasurements);
  }

  private async collect(
    sortedMeasurements: MeasurementEntity[],
    maxTimeDelta = 10000,
  ): Promise<any[]> {
    const assigned: any[] = [];

    let powerIndex = sortedMeasurements.findIndex((m) => m.T == this.consKey);
    if (powerIndex == -1) {
      return [];
    }

    let accs = [];
    let spds = [];

    let first = true;

    for (let i = 0; i < sortedMeasurements.length; i++) {
      const type: string = sortedMeasurements[i].T;

      if (type == this.spdKey) {
        spds.push(i);
      } else if (type == this.accKey) {
        accs.push(i);
      }

      if (type == this.consKey && first) {
        first = false;
      } else if (type == this.consKey || i == sortedMeasurements.length - 1) {
        // Have reached the next powerIndex. Add the current
        const currentPower = sortedMeasurements[powerIndex];

        let spds1 = spds
          .sort(
            (a, b) =>
              Math.abs(
                sortedMeasurements[a].Created_Date.getTime() -
                  currentPower.Created_Date.getTime(),
              ) -
              Math.abs(
                sortedMeasurements[b].Created_Date.getTime() -
                  currentPower.Created_Date.getTime(),
              ),
          ).slice(0, 2);

        let accs1 = accs
          .sort(
            (a, b) =>
              Math.abs(
                sortedMeasurements[a].Created_Date.getTime() -
                  currentPower.Created_Date.getTime(),
              ) -
              Math.abs(
                sortedMeasurements[b].Created_Date.getTime() -
                  currentPower.Created_Date.getTime(),
              ),
          )
          .slice(0, 2);

        assigned.push([spds1, accs1]);

        spds = spds.filter((index) => index > powerIndex);
        accs = accs.filter((index) => index > powerIndex);

        Console.log(powerIndex);

        powerIndex = i;

        Console.log(powerIndex);

      }
    }

    return assigned;
  }

  private timeDeltaExceeded(
    dateA: Date,
    dateB: Date,
    timeDelta: number,
  ): boolean {
    return Math.abs(dateA.getTime() - dateB.getTime()) > timeDelta;
  }
}
