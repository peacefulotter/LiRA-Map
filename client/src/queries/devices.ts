import { WaysConditions, ValueLatLng } from '../models/path';
import { get } from './fetch';
import { DeviceProperties } from '../models/properties';

export const getDevices = (setDevices: (data: DeviceProperties[]) => void) => {
  get('/devices', setDevices);
};
