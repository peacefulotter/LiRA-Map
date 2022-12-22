/** @author Benjamin Lumbye s204428 */

import { Controller, Post } from '@nestjs/common';
import { MuService } from './mu.service';

@Controller('mu')
export class MuController {
  constructor(private readonly service: MuService) {}

  @Post('calculate')
  calculateMu(): Promise<string> {
    return this.service.calculateMu();
  }
}
