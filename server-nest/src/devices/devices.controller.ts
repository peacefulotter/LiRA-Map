import { Controller, Get, Put, Query } from '@nestjs/common';
import { DeviceService } from './devices.service';

import { DeviceMeta } from './models.devices';

/*/** @author Mads Møller s184443, Martin Nielsen s174971 * */

@Controller('devices')
export class DeviceController {
  constructor(private readonly service: DeviceService) {}

  @Get('/')
  getDevice(): Promise<DeviceMeta[]> {
    return this.service.getDevices();
  }
}
