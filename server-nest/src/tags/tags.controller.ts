import { Controller, Get, Query } from '@nestjs/common';
import { TagsService } from './tags.service';

import { TagMeta } from './models.tags';
import { BoundedPath } from 'src/models';

@Controller('tags')
export class TagsController {
  constructor(private readonly service: TagsService) {}

  @Get('/')
  getTags(): Promise<TagMeta[]> {
    //return this.service.getRides();
    console.log('Test');
    return this.service.getTags();
  }
}
