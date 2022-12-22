import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';

import { DeviceMeta } from './models.devices';
import { BoundedPath, PointData } from 'src/models';
import { readFile } from 'fs/promises';

/** @author Mads Møller s184443, Martin Nielsen s174971 */

@Injectable()
export class DeviceService {
  constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

  async getDevices(): Promise<DeviceMeta[]> {
    return this.knex
      .select('DeviceId')
      .from({ public: 'Devices' })
      .orderBy('DeviceId');
  }
}
