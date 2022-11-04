import { Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';
import { RideMeta } from '../rides/models.rides';
import { MeasurementEntity, Message, Test } from './EnergyInterfaces';
import { Measurement } from '../models';

@Injectable()
export class EnergyService {
  constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

  async get(tripId: string): Promise<number> {
    const relevantMeasurements: MeasurementEntity[] = await this.knex
      .select('*')
      .from({ public: 'Measurements' })
      .where('FK_Trip', tripId)
      .whereIn('T', ['acc.xyz', 'obd.spd_veh', 'obd.trac_cons'])
      .orderBy('Created_Date');

    // For intial testing.
    const list: any[] = await this.collect(relevantMeasurements);
    return list.length;
  }

  async collect(
    sortedMeasurements: MeasurementEntity[],
    maxTimeDelta = 500,
  ): Promise<any[]> {
    const assigned: {
      power: MeasurementEntity;
      assigned: MeasurementEntity[];
    }[] = [];

    let beforeIndex = 0;
    let powerIndex = 0;
    let afterIndex = 0;

    let currentPower: MeasurementEntity;

    while (
      beforeIndex < sortedMeasurements.length &&
      afterIndex < sortedMeasurements.length
    ) {
      if (
        sortedMeasurements[afterIndex].T == 'obd.trac_cons' &&
        powerIndex < beforeIndex
      ) {
        // Have reached the powerIndex INSIDE before and after index.
        powerIndex = afterIndex;
      } else if (
        sortedMeasurements[afterIndex].T == 'obd.trac_cons' ||
        (afterIndex == sortedMeasurements.length - 1 &&
          sortedMeasurements[powerIndex].T == 'odb.trac_cons')
      ) {
        // Have reached the next powerIndex. Add the current
        currentPower = sortedMeasurements[powerIndex];

        assigned.push({
          power: currentPower,
          assigned: sortedMeasurements
            .slice(beforeIndex, afterIndex + 1)
            .filter(
              (m) =>
                Math.abs(
                  m.Created_Date.getTime() -
                    currentPower.Created_Date.getTime(),
                ) <= maxTimeDelta && m.T != 'obd.trac_cons',
            ),
        });

        beforeIndex = powerIndex + 1;
      }
      afterIndex++;
    }

    return assigned;
  }
}
