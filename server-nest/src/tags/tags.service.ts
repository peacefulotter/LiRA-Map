// @author Matteo Hoffmann s222952, Mads Westerman s174508

import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nestjs-knex';
import { Knex } from 'knex';

import { TagMeta } from './models.tags';
import { BoundedPath, PointData } from 'src/models';
import { readFile } from 'fs/promises';

@Injectable()
export class TagsService {
  path: string;
  tagNamesDict: any;

  constructor(@InjectConnection('lira-main') private readonly knex: Knex) {
    this.path = __dirname + '/tagNames.json';
    this.loadFile();
  }

  async loadFile() {
    const file = await readFile(this.path, 'utf-8');
    const tagNamesJSON = JSON.parse(file);
    this.tagNamesDict = Object.assign(
      {},
      ...tagNamesJSON.map((name) => ({ [name.autoPiName]: name.canZeName })),
    );
  }

  async getTags(): Promise<TagMeta[]> {
    return this.knex
      .select('*')
      .from({ public: 'MeasurementTypes' })
      .orderBy('type')
      .then((result) => {
        result.forEach((element, index) => {
          const readableName = this.getReadableName(element);
          result[index].readableName = readableName ? readableName : '';
        });
        return result;
      });
  }

  private getReadableName(meta: TagMeta) {
    if (this.tagNamesDict != undefined) {
      return this.tagNamesDict[meta.type];
    }
  }
}
