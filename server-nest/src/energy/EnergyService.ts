import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';
import { RideMeta } from '../rides/models.rides';
import { getPreciseDistance } from 'geolib';
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
  calibratePower,
  calcSpd,
  calcWhlTrq,
  calcEnergyAero,
  linInterp,
  calcEnergyWhlTrq,
  calcEnergySlope,
  calcEnergyInertia,
  getMeasVal,
} from './EnergyMath';
import { GeolibInputCoordinates } from 'geolib/es/types';

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
    const assignments: Array<
      [number, Map<string, number>, Map<string, number>]
    > = await this.collectMeas(relevantMeasurements);

    const distancesGPS = new Array<number>(assignments.length);
    distancesGPS[0] = 0;
    for (let i = 1; i < assignments.length; i++) {
      const [j] = assignments[i];
      const curPower = relevantMeasurements[j];
      const [prev] = assignments[i - 1];
      const prevPower = relevantMeasurements[prev];
      const dist = getPreciseDistance(
        { latitude: curPower.lat, longitude: curPower.lon },
        { latitude: prevPower.lat, longitude: prevPower.lon },
        0.5,
      );
      distancesGPS[i] =
        dist < 2 ? distancesGPS[i - 1] : distancesGPS[i - 1] + dist;
    }

    const startTime = relevantMeasurements[0].Created_Date.getTime();
    const endTime = relevantMeasurements.at(-1).Created_Date.getTime();
    const sumOfPeriods = endTime - startTime;
    const sumOfPeriodsSeconds = sumOfPeriods / 1000;
    const delta = sumOfPeriodsSeconds / assignments.length;

    return assignments.map(([i, before, after], index) => {
      const pwr = relevantMeasurements[i];
      const pwrVal = calibratePower(pwr);
      const energyVal = (pwrVal * delta) / 3600;

      const spdBefore = relevantMeasurements[before.get(this.spdTag)];
      const spdAfter = relevantMeasurements[after.get(this.spdTag)];
      const spd = calcSpd(spdBefore, spdAfter, pwr);

      const dist = delta * spd;

      const accBefore = relevantMeasurements[before.get(this.accLongTag)];
      const accAfter = relevantMeasurements[after.get(this.accLongTag)];
      const acc = calcAcc(accBefore, accAfter, pwr);

      const whlTrqBefore = relevantMeasurements[before.get(this.whlTrqTag)];
      const whlTrqAfter = relevantMeasurements[after.get(this.whlTrqTag)];
      const whlTrq = calcWhlTrq(whlTrqBefore, whlTrqAfter, pwr);

      const energyWhlTrq = calcEnergyWhlTrq(whlTrq, dist);
      const energySlope = calcEnergySlope(0, 0, dist);
      const energyInertia = calcEnergyInertia(acc, dist);
      const energyAero = calcEnergyAero(spd, dist);
      const pwrNormalised =
        energyVal - energyWhlTrq - energySlope - energyInertia - energyAero;

      return {
        result: pwrNormalised,
        prev_power: energyVal,
        whlTrq: energyWhlTrq,
        slope: energySlope,
        inertia: energyInertia,
        aero: energyAero,
      };
    });
  }

  private async getRelevantMeasurements(tripId: string) {
    return this.knex
      .select('*')
      .from({ public: 'Measurements' })
      .where('FK_Trip', tripId)
      .whereIn('T', [this.consTag].concat(this.measTypes))
      .orderBy('Created_Date');
  }

  private async collectMeas(sortedMeasurements: MeasEnt[]): Promise<any[]> {
    const powerIndex = sortedMeasurements.findIndex((m) => m.T == this.consTag);
    if (powerIndex == -1) {
      return [];
    }

    const assigned: any[] = [];

    let measBefore: Map<string, number>;
    let measAfter: Map<string, number>;
    for (let i = powerIndex; i < sortedMeasurements.length; i++) {
      const curMeasType: string = sortedMeasurements[i].T;
      if (curMeasType == this.consTag) {
        measBefore = this.findMeas(sortedMeasurements, i, 'before');
        measAfter = this.findMeas(sortedMeasurements, i, 'after');
        if (measBefore && measAfter) {
          assigned.push([i, measBefore, measAfter]);
        }
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
        measMap = measMap.set(curMeasType, i);
      }
      foundAll = this.measTypes.every((key) => measMap.has(key));
    }

    if (foundAll) {
      return measMap;
    }

    return null;
  }
}
