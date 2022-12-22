/** @author Benjamin Lumbye s204428 */

import { AxiosResponse } from 'axios';
import { realAsyncPost } from './fetch';

export async function calculateMu(): Promise<AxiosResponse<string>> {
  return realAsyncPost<string>('/mu/calculate', null);
}
