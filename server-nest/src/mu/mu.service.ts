import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';
import { randomUUID } from 'crypto';

const beta_front_right = 3;
const beta__zero = 1;
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
        .select('*')
        .from({ public: 'Measurements' })
        .where({ FK_Trip: ride.TripId })
        .whereIn('T', ['obd.rpm_fr', 'obd.rpm_rr'])
        .whereNot({ lat: null, lon: null })
        .orderBy('TS_or_Distance');
      const rpms_front = data.filter((d) => d.T === 'obd.rpm_fr');
      const rpms_rear = data.filter((d) => d.T === 'obd.rpm_rr');
      const points: {
        MeasurementId: string;
        TS_or_Distance: Date;
        T: 'mu_right';
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
      for (
        let i = 0;
        i < Math.min(rpms_front.length / 5, rpms_rear.length / 5);
        i++
      ) {
        const RPM_rear = parseFloat(rpms_rear[i * 5].Description);
        const RPM_front = parseFloat(rpms_front[i * 5].Description);
        const mu_right =
          Math.log(
            (beta_front_right * wheel_radius) /
              (wheel_radius * (RPM_front - RPM_rear)) +
              1,
          ) ^
          (1 / beta__zero);
        const MeasurementId = randomUUID();
        const spdMessage = JSON.parse(rpms_rear[i].message);
        const message = JSON.stringify({
          id: spdMessage.id,
          start_time_utc: spdMessage.start_time_utc,
          end_time_utc: spdMessage.end_time_utc,
          '@vid': spdMessage['@vid'],
          '@uid': MeasurementId,
          '@ts': rpms_rear[i].TS_or_Distance,
          '@t': 'mu_right',
          'mu.value': mu_right,
          '@rec': spdMessage['@rec'],
        });

        //Logger.debug('\n Message', message);
        if (
          isNaN(mu_right) ||
          mu_right === Infinity ||
          RPM_front === 0 ||
          RPM_rear === 0
        )
          continue;

        points.push({
          MeasurementId: MeasurementId,
          TS_or_Distance: rpms_rear[i].TS_or_Distance,
          T: 'mu_right',
          lat: rpms_rear[i].lat,
          lon: rpms_rear[i].lon,
          message: message,
          isComputed: true,
          FK_Trip: ride.TripId,
          FK_MeasurementType: '59644af0-34da-4f03-b08c-456d38b0c56e',
          Created_Date: rpms_rear[i].Created_Date,
          Updated_Date: rpms_rear[i].Updated_Date,
          Description: mu_right,
        });
        //Logger.debug('\n Updated Date', spds[i].Updated_Date);
        //Logger.debug('FK_Trip', ride.TripId);
        if (mu_right < 0)
          Logger.debug(
            'Speed \t' +
              rpms_rear[i * 5].Description * wheel_radius +
              '\n RPM \t' +
              rpms_front[i * 5].Description +
              '\n Mu \t' +
              mu_right +
              '\n',
          );
      }
      //this.knex.batchInsert('Measurements', points);
    }
  }
}
