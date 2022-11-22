import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';
import { RideMeta } from '../rides/models.rides';
import {
  AccLongMessage,
  MeasEnt,
  Message,
  SpeedMessage,
  Test,
} from './EnergyInterfaces';
import { Measurement } from '../models';
import * as Console from 'console';
import {
  calcAcc,
  calcPower,
  calcSpd,
  calcWhlTrq,
  linInterp,
} from './EnergyMath';
import { of, toArray } from 'rxjs';

@Injectable()
export class EnergyService {
  constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

  private readonly accLongTag = 'obd.acc_long';
  private readonly spdTag = 'obd.spd_veh';
  private readonly consTag = 'obd.trac_cons';
  private readonly whlTrqTag = 'obd.whl_trq_est';

  private readonly measTypes = [this.accLongTag, this.spdTag, this.whlTrqTag];

  public async get(tripId: string): Promise<any> {
    const relevantMeasurements: MeasEnt[] = await this.getRelevantMeasurements(
      tripId,
    );

    console.log(this.measTypes);

    // For intial testing.
    return await this.collectMeas(relevantMeasurements);
  }

  private async getRelevantMeasurements(tripId: string) {
    return this.knex
      .select('*')
      .from({ public: 'Measurements' })
      .where('FK_Trip', tripId)
      .whereIn('T', [this.consTag].concat(this.measTypes))
      .orderBy('Created_Date')
      .limit(20);
  }

  private async collectMeas(sortedMeasurements: MeasEnt[]): Promise<any[]> {
    const assigned: any[] = [];

    const powerIndex = sortedMeasurements.findIndex((m) => m.T == this.consTag);
    if (powerIndex == -1) {
      return [];
    }

    for (let i = powerIndex; i < sortedMeasurements.length; i++) {
      const curMeasType: string = sortedMeasurements[i].T;
      if (curMeasType == this.consTag) {
        const measBefore: Map<string, number> = this.findMeas(
          sortedMeasurements,
          i,
          'before',
        );
        const measAfter: Map<string, number> = this.findMeas(
          sortedMeasurements,
          i,
          'after',
        );
        assigned.push([i, measBefore, measAfter]);
      }
    }

    return assigned;
  }

  private findMeas(
    meas: MeasEnt[],
    index: number,
    direction: 'before' | 'after',
  ) {
    let measMap: Map<string, number> = new Map<string, number>();
    let foundAll = false;

    const guard: (_: number) => boolean = (n) =>
      direction == 'after' ? n < meas.length : n >= 0;
    const update: (_: number) => number = (n) =>
      direction == 'after' ? n + 1 : n - 1;

    for (let i = index; !foundAll && guard(i); i = update(i)) {
      const curMeas = meas[i];
      const curMeasType: string = curMeas.T;
      if (!measMap.has(curMeasType) && this.measTypes.includes(curMeasType)) {
        measMap = measMap.set(curMeasType.toString(), i);
      }
      foundAll = this.measTypes.every((value) => measMap.has(value));
    }
    return measMap;
  }
}
