/** @author Matteo Hoffmann s222952, Mads Westerman s174508 */

import { Controller, Get, Put, Query } from '@nestjs/common';
import { TagsService } from './tags.service';

import { TagMeta } from './models.tags';

@Controller('tags')
export class TagsController {
  constructor(private readonly service: TagsService) {}

  @Get('/')
  getTags(): Promise<TagMeta[]> {
    return this.service.getTags();
  }
}
