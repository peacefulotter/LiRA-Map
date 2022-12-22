import { WaysConditions, ValueLatLng } from '../models/path';
import { get } from './fetch';
import { DeviceProperties } from '../models/properties';

/** @author Mads Møller s184443, Martin Nielsen s174971 */

export const getDevices = (setDevices: (data: DeviceProperties[]) => void) => {
  get('/devices', setDevices);
};
