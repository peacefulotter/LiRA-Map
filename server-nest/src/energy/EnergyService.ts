import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';
import { RideMeta } from '../rides/models.rides';
import {
  AccLongMessage,
  MeasurementEntity,
  Message,
  SpeedMessage,
  Test,
} from './EnergyInterfaces';
import { Measurement } from '../models';
import * as Console from 'console';

@Injectable()
export class EnergyService {
  constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

  private readonly accLongTag = 'obd.acc_long';
  private readonly spdTag = 'obd.spd_veh';
  private readonly consTag = 'obd.trac_cons';
  private readonly whlTrqTag = 'obd.whl_trq_est';

  private readonly measTypes = [this.accLongTag, this.spdTag, this.whlTrqTag];

  // https://en.wikipedia.org/wiki/Linear_interpolation#Linear_interpolation_between_two_known_points
  private linearInterpolate(
    x: number,
    [x0, y0]: [number, number],
    [x1, y1]: [number, number],
  ): number {
    // assert x0 <= x1
    return (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0);
  }

  private getMeasVal(meas: MeasurementEntity): number {
    const valueTag: string = meas.T + '.value';
    const message: JSON = meas.message;

    if (message.hasOwnProperty(valueTag)) {
      return message[valueTag];
    }
  }

  private calcSpd(
    spdBefore: MeasurementEntity,
    spdAfter: MeasurementEntity,
    curPower: MeasurementEntity,
  ) {
    const dateBefore = spdBefore.Created_Date.getTime();
    const spdBeforeMPS = this.getMeasVal(spdBefore) / 3.6;

    const dateAfter = spdAfter.Created_Date.getTime();
    const spdAfterMPS = this.getMeasVal(spdAfter) / 3.6;

    return this.linearInterpolate(
      curPower.Created_Date.getTime(),
      [dateBefore, spdBeforeMPS],
      [dateAfter, spdAfterMPS],
    );
  }

  private calcAcc(
    accBefore: MeasurementEntity,
    accAfter: MeasurementEntity,
    curPower: MeasurementEntity,
  ) {
    const dateBefore = accBefore.Created_Date.getTime();
    const accBeforeVal = (this.getMeasVal(accBefore) - 2 * 198) * 0.05;

    const dateAfter = accAfter.Created_Date.getTime();
    const accAfterVal = (this.getMeasVal(accBefore) - 2 * 198) * 0.05;

    return this.linearInterpolate(
      curPower.Created_Date.getTime(),
      [dateBefore, accBeforeVal],
      [dateAfter, accAfterVal],
    );
  }

  private calcPower(curPower: MeasurementEntity) {
    return (this.getMeasVal(curPower) - 160) * 1000;
  }

  private calcWhlTrq(
    whlTrqBefore: MeasurementEntity,
    whlTrqAfter: MeasurementEntity,
    curPower: MeasurementEntity,
  ) {
    const dateBefore = whlTrqBefore.Created_Date.getTime();
    const whlTrqBeforeVal = this.getMeasVal(whlTrqBefore);

    const dateAfter = whlTrqBefore.Created_Date.getTime();
    const whlTrqAfterVal = this.getMeasVal(whlTrqAfter);

    return (
      this.linearInterpolate(
        curPower.Created_Date.getTime(),
        [dateBefore, whlTrqBeforeVal],
        [dateAfter, whlTrqAfterVal],
      ) - 51300
    );
  }

  public async get(tripId: string): Promise<any> {
    const relevantMeasurements: MeasurementEntity[] = await this.knex
      .select('*')
      .from({ public: 'Measurements' })
      .where('FK_Trip', tripId)
      .whereIn('T', [this.consTag].concat(this.measTypes))
      .orderBy('Created_Date')
      .limit(1000);

    // For intial testing.
    return await this.collect(relevantMeasurements);
  }

  private async collect(
    sortedMeasurements: MeasurementEntity[],
  ): Promise<any[]> {
    const assigned: any[] = [];

    const powerIndex = sortedMeasurements.findIndex((m) => m.T == this.consTag);
    if (powerIndex == -1) {
      return [];
    }

    for (let i = powerIndex; i < sortedMeasurements.length; i++) {
      const curMeasType: string = sortedMeasurements[i].T;

      if (curMeasType == this.consTag) {
        // The current measurement is a power measurement, and we now begin traversing first backwards,
        // then forwards, to find closest relevant values to use for interpolation.

        const currentPower = sortedMeasurements[i];

        // begin backwards traversal, until we have found all needed measurements.
        let foundAll = false;

        const measBefore = new Map<string, number>();

        for (let j = i; !foundAll && j >= 0; j--) {
          const curMeas = sortedMeasurements[j];
          const curMeasType: string = curMeas.T;

          // Is this one of the measurement types that we are looking for?
          //console.log(this.measTypes)
          //console.log(curMeasType)
          if (this.measTypes.includes(curMeasType)) {
            // Did we already record this?
            if (!measBefore.has(curMeasType)) {
              // No, record it!

              measBefore[curMeasType] = curMeas;
            }
          }

          // Check if we're done.
          foundAll = this.measTypes.every((value) => {
            measBefore.has(value);
          });
        }
        console.log(measBefore);

        const measAfter = new Map<string, number>();
        foundAll = false;

        for (let j = i; !foundAll && j < sortedMeasurements.length; j++) {
          const curMeas = sortedMeasurements[j];
          const curMeasType: string = curMeas.T;

          // Is this one of the measurement types that we are looking for?
          if (this.measTypes.includes(curMeasType)) {
            // Did we already record this?
            if (!measAfter.has(curMeasType)) {
              // No, record it!
              measAfter[curMeasType] = curMeas;
            }
          }

          // Check if we're done.
          foundAll = this.measTypes.every((value) => {
            measAfter.has(value);
          });
        }
      }
    }

    return assigned;
  }
}
