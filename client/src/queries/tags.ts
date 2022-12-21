// @author Matteo Hoffmann s222952, Mads Westerman s174508
import { get } from './fetch';
import { TagProperties } from '../models/properties';

export const getTags = (setTags: (data: TagProperties[]) => void) => {
  get('/tags', setTags);
};
