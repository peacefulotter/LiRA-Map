import { WaysConditions, ValueLatLng } from '../models/path';
import { get } from './fetch';
import { TagProperties } from '../models/properties';

export const getTags = (setTags: (data: TagProperties[]) => void) => {
  get('/tags', setTags);
};
