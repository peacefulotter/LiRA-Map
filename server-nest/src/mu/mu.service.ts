import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';
import { randomUUID } from 'crypto';

const beta_front_right = 3;
const wheel_radius = 0.31;
@Injectable()
export class MuService implements OnApplicationBootstrap {
  constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

  async onApplicationBootstrap() {
    const rides = await this.knex
      .select('*')
      .from({ public: 'Trips' })
      .whereNot('TaskId', 0)
      .orderBy('TaskId');
    for (const ride of rides) {
      const data = await this.knex
        .select(['Description', 'lat', 'lon', 'T', 'TS_or_Distance', 'message'])
        .from({ public: 'Measurements' })
        .where({ FK_Trip: ride.TripId })
        .whereIn('T', ['obd.rpm_fr', 'obd.spd'])
        .whereNot({ lat: null, lon: null })
        .orderBy('TS_or_Distance');
      const rpms = data.filter((d) => d.T === 'obd.rpm_fr');
      const spds = data.filter((d) => d.T === 'obd.spd');
      const points: {
        MeasurementId: string;
        TS_or_Distance: Date;
        T: 'mu';
        lat: number;
        lon: number;
        message: string;
        isComputed: boolean;
        FK_Trip: string;
        FK_MeasurementType;
        Created_Date: any;
        Updated_Date: any;
        Description: number;
      }[] = [];
      for (let i = 0; i < Math.min(rpms.length / 5, spds.length); i++) {
        const mu = Math.log(
          (beta_front_right * wheel_radius) /
            (wheel_radius * rpms[i * 5].Description - spds[i].Description) +
            1,
        );
        if (isNaN(mu) || mu === Infinity) continue;
        points.push({
          MeasurementId: randomUUID(),
          TS_or_Distance: spds[i].TS_or_Distance,
          T: 'mu',
          lat: spds[i].lat,
          lon: spds[i].lon,
          message: JSON.stringify({
            ...JSON.parse(spds[i].message),
            'mu.value': mu,
          }),
          isComputed: true,
          FK_Trip: ride.TripId,
          FK_MeasurementType: '59644af0-34da-4f03-b08c-456d38b0c56e',
          Created_Date: this.knex.fn.now(),
          Updated_Date: this.knex.fn.now(),
          Description: mu,
        });
      }
      this.knex.batchInsert('Measurements', points);
    }
  }
}
