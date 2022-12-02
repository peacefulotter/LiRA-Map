import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';
import { randomUUID } from 'crypto';

/*
 * Three assumptions are made:
 * 1. The time difference between each measurement is almost equal
 * 2. The frequency for all four measurements are equal
 * 3. The wheel radius are equal on all four wheels
 *
 * From looking at the data we cannot assume that each index in
 * front and rear corresponds to the same time, but right and left do.
 */

interface PointData {
  MeasurementId: string;
  TS_or_Distance: Date;
  T: 'mu_right' | 'mu_left' | 'mu_avg';
  lat: number;
  lon: number;
  message: string;
  isComputed: boolean;
  FK_Trip: string;
  FK_MeasurementType:
    | '59644af0-34da-4f03-b08c-456d38b0c56e'
    | 'fa9d232d-5f4e-4acf-9cbb-124af10d59ab'
    | '3d2a7296-be08-4df8-98b0-9a9902edd085';
  Created_Date: any;
  Updated_Date: any;
  Description: number;
}

const beta_front_right = 3;
const beta__zero = 1;
const wheel_radius = 0.31;

const wantedFrequency = 50; // Hz

@Injectable()
export class MuService {
  constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

  async calculateMu(): Promise<string> {
    // Start out by deleting all existing mu measurements in the database
    await this.knex
      .delete()
      .from({ public: 'Measurements' })
      .whereIn('T', ['mu_right', 'mu_left', 'mu_avg']);

    const insertionPromises: Promise<any>[] = [];
    const rides = await this.knex
      .select('*')
      .from({ public: 'Trips' })
      .whereNot('TaskId', 0)
      .orderBy('TaskId');
    for (const ride of rides) {
      // Gather data from the database
      const data = await this.knex
        .select('*')
        .from({ public: 'Measurements' })
        .where({ FK_Trip: ride.TripId })
        .whereIn('T', ['obd.rpm_fr', 'obd.rpm_rr', 'obd.rpm_fl', 'obd.rpm_rl'])
        .whereNot({ lat: null, lon: null })
        .orderBy('TS_or_Distance');
      const rpms_fr = data.filter((d) => d.T === 'obd.rpm_fr');
      const rpms_rr = data.filter((d) => d.T === 'obd.rpm_rr');
      const rpms_fl = data.filter((d) => d.T === 'obd.rpm_fl');
      const rpms_rl = data.filter((d) => d.T === 'obd.rpm_rl');
      //Logger.debug('\n rpms_fr: ' + JSON.stringify(rpms_fr));
      // Calculate the frequency to resample data for 50 Hz
      const durationDate = new Date(ride.Duration);
      const duration =
        durationDate.getHours() * 3600 +
        durationDate.getMinutes() * 60 +
        durationDate.getSeconds();
      const meas_frequency = rpms_fr.length / duration;
      const frequency_const = Math.max(
        Math.round(meas_frequency / wantedFrequency),
        1,
      );

      const points_right: PointData[] = [];
      const points_left: PointData[] = [];
      const points_avg: PointData[] = [];

      // Calculation mu
      let prevRearIndex = 0;
      for (let i = 0; i < rpms_fl.length / frequency_const; i++) {
        // Find the best match for the rear wheels
        const frTime = new Date(
          rpms_fr[i * frequency_const].TS_or_Distance,
        ).getTime();
        let closestIndex = -1;
        let closestTimeDiff = Infinity;

        for (let j = prevRearIndex; j < rpms_rl.length; j++) {
          const rrTime = new Date(rpms_rr[j].TS_or_Distance).getTime();
          if (Math.abs(rrTime - frTime) < closestTimeDiff) {
            closestIndex = j;
            closestTimeDiff = Math.abs(rrTime - frTime);
          }
          if (rrTime > frTime) break;
        }
        if (closestIndex === -1) continue;
        prevRearIndex = closestIndex;

        // Get the values for the four wheels
        const RPM_fr = parseFloat(rpms_fr[i * frequency_const].Description);
        const RPM_rr = parseFloat(rpms_rr[closestIndex].Description);
        const RPM_fl = parseFloat(rpms_fl[i * frequency_const].Description);
        const RPM_rl = parseFloat(rpms_rl[closestIndex].Description);

        // NOTE: Currently not using math.pow() since it generate invalid results and that 1/1 = 1 and
        // something to the power of 1 gives the same result as not putting it to the power of 1.
        // Defining the mus
        const mu = (RPM_front: number, RPM_rear: number) =>
          Math.log(
            (beta_front_right * wheel_radius) /
              (wheel_radius * RPM_front - RPM_rear * wheel_radius) +
              1,
          );
        const mu_right = mu(RPM_fr, RPM_rr);
        const mu_left = mu(RPM_fl, RPM_rl);
        const mu_avg = (mu_right + mu_left) / 2;

        // Insert the data in the arrays
        const MeasurementId_right = randomUUID();
        const MeasurementId_left = randomUUID();
        const MeasurementId_avg = randomUUID();
        const flMessage = JSON.parse(rpms_fl[i * frequency_const].message);
        const message = {
          id: flMessage.id,
          start_time_utc: flMessage.start_time_utc,
          end_time_utc: flMessage.end_time_utc,
          '@vid': flMessage['@vid'],
          '@ts': rpms_fl[i * frequency_const].TS_or_Distance,
          '@rec': flMessage['@rec'],
        };

        const message_right = {
          ...message,
          '@t': 'mu_right',
          'mu_right.value': mu_right,
          '@uid': MeasurementId_right,
        };
        const message_left = {
          ...message,
          '@t': 'mu_left',
          'mu_left.value': mu_left,
          '@uid': MeasurementId_left,
        };
        const message_avg = {
          ...message,
          '@t': 'mu_avg',
          'mu_avg.value': mu_avg,
          '@uid': MeasurementId_avg,
        };

        // Push the data to the arrays
        const pointData = {
          TS_or_Distance: rpms_fl[i * frequency_const].TS_or_Distance,
          lat: rpms_fl[i * frequency_const].lat,
          lon: rpms_fl[i * frequency_const].lon,
          isComputed: true,
          FK_Trip: ride.TripId,
          Created_Date: rpms_fl[i * frequency_const].Created_Date,
          Updated_Date: rpms_fl[i * frequency_const].Updated_Date,
        };
        // Skip this point if the data is bad
        if (
          !isNaN(mu_right) &&
          mu_right !== Infinity &&
          !(mu_right < 0) &&
          RPM_fr !== 0 &&
          RPM_rr !== 0
        ) {
          points_right.push({
            ...pointData,
            MeasurementId: MeasurementId_right,
            T: 'mu_right',
            message: JSON.stringify(message_right),
            FK_MeasurementType: '59644af0-34da-4f03-b08c-456d38b0c56e',
            Description: mu_right,
          });
        }
        if (
          !isNaN(mu_left) &&
          mu_left !== Infinity &&
          !(mu_left < 0) &&
          RPM_fl !== 0 &&
          RPM_rl !== 0
        ) {
          points_left.push({
            ...pointData,
            MeasurementId: MeasurementId_left,
            T: 'mu_left',
            message: JSON.stringify(message_left),
            FK_MeasurementType: 'fa9d232d-5f4e-4acf-9cbb-124af10d59ab',
            Description: mu_avg,
          });
        }
        if (
          !isNaN(mu_avg) &&
          mu_avg !== Infinity &&
          !(mu_avg < 0) &&
          RPM_fr !== 0 &&
          RPM_fl !== 0 &&
          RPM_rl !== 0 &&
          RPM_rr !== 0
        ) {
          points_avg.push({
            ...pointData,
            MeasurementId: MeasurementId_avg,
            T: 'mu_avg',
            message: JSON.stringify(message_avg),
            FK_MeasurementType: '3d2a7296-be08-4df8-98b0-9a9902edd085',
            Description: mu_avg,
          });
        }

        //Logger.debug('FK_Trip', ride.TripId);
        //   if (mu_right < 0)
        //     Logger.debug(
        //       'Speed \t' +
        //         rpms_fl[i * frequency_const].Description * wheel_radius_fr +
        //         '\n RPM_front \t' +
        //         rpms_fr[i * 5].Description +
        //         '\n RPM_rear \t' +
        //         rpms_rr[i * 5].Description +
        //         '\n Mu \t' +
        //         mu_right +
        //         '\n',
        //     );
      }
      insertionPromises.push(
        this.knex.batchInsert('Measurements', [
          ...points_right,
          ...points_left,
          ...points_avg,
        ]),
      );
    }
    await Promise.allSettled(insertionPromises);
    Logger.log('Mu calculation done');
    return 'Mu calculation done';
  }
}
