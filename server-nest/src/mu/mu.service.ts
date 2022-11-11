import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';
const RPM_Front_Right = 'obd.rpm_fr';
const RPM_Rear_Right = 'obd.rpm_rr';
const Car_Velocity = 'obd.spd_veh';
const RPM_Front_Left = 'obd.rpm_fl';
const RPM_Rear_Left = 'obd.rpm_rl';
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
      Logger.debug('rides', JSON.stringify(ride.TripId));
      const data = await this.knex
        .select(['Description', 'lat', 'lon', 'T'])
        .from({ public: 'Measurements' })
        .where({ FK_Trip: ride.TripId })
        .whereIn('T', ['obd.rpm_fr', 'obd.spd_veh'])
        .whereNot({ lat: null, lon: null })
        .orderBy('TS_or_Distance');
    }

    return rides;
  }
}
