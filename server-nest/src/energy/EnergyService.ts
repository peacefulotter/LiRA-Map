import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';
import { RideMeta } from '../rides/models.rides';
import { MeasurementEntity, Message, Test } from './EnergyInterfaces';
import { Measurement } from '../models';

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
      .orderBy('Created_Date');

    // For intial testing.
    const list: any[] = await this.collect(relevantMeasurements);
    return list.length;
  }

  private async collect(
    sortedMeasurements: MeasurementEntity[],
    maxTimeDelta = 500,
  ): Promise<any[]> {
    const assigned: {
      power: number;
      assigned: number[];
    }[] = [];

    let powerIndex = sortedMeasurements.findIndex((m) => m.T == this.consKey);
    if (powerIndex == -1) {
      return [];
    }

    let beforeIndex = 0;
    let afterIndex;

    for (
      afterIndex = powerIndex + 1;
      afterIndex < sortedMeasurements.length;
      afterIndex++
    ) {
      if (
        sortedMeasurements[afterIndex].T == this.consKey ||
        afterIndex == sortedMeasurements.length - 1
      ) {
        // Have reached the next powerIndex. Add the current
        const currentPower = sortedMeasurements[powerIndex];

        assigned.push({
          power: powerIndex,
          assigned: sortedMeasurements
            .slice(beforeIndex, afterIndex)
            .reduce((prev: number[], m, i) => {
              if (
                Math.abs(
                  m.Created_Date.getTime() -
                    currentPower.Created_Date.getTime(),
                ) <= maxTimeDelta &&
                m.T != this.consKey
              ) {
                prev.push(beforeIndex + i);
              }
              return prev;
            }, [] as number[]),
        });

        beforeIndex = powerIndex + 1;
        powerIndex = afterIndex;
      }
    }

    return assigned;
  }
}
