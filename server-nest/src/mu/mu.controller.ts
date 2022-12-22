import { Controller, Post } from '@nestjs/common';
import { MuService } from './mu.service';
/**@author Emil Kim Krarup (s204449) */

@Controller('mu')
export class MuController {
  constructor(private readonly service: MuService) {}

  @Post('calculate')
  calculateMu(): Promise<string> {
    return this.service.calculateMu();
  }
}
