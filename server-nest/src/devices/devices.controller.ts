import { Controller, Get, Put, Query } from '@nestjs/common';
import { DeviceService } from './devices.service';

import { DeviceMeta } from './models.devices';

@Controller('devices')
export class DeviceController {
  constructor(private readonly service: DeviceService) {}

  @Get('/')
  getDevice(): Promise<DeviceMeta[]> {
    return this.service.getDevices();
  }
}