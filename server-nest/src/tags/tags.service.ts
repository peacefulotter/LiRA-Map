import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';

import { TagMeta } from './models.tags';
import { BoundedPath, PointData } from 'src/models';

@Injectable()
export class TagsService {
  constructor(@InjectConnection('lira-main') private readonly knex: Knex) {}

  async getTags(): Promise<TagMeta[]> {
    return this.knex
      .select('*')
      .from({ public: 'MeasurementTypes' })
      .orderBy('type');
  }

  async getTag(tripId: string, dbName: string): Promise<BoundedPath> {
    return null;
  }
}
