import { Dispatch, SetStateAction } from 'react';
import { RideMeta } from '../models/models';
import { BoundedPath, Metadata } from '../models/path';
import { ActiveMeasProperties } from '../models/properties';
import { ToastFunc } from '../models/toast';
import { asyncPost, get } from './fetch';

export const getRides = (callback: Dispatch<SetStateAction<RideMeta[]>>) => {
  get('/rides', callback);
};

export const getRide = async (
  measurement: ActiveMeasProperties,
  meta: Metadata,
  toast: ToastFunc,
) => {
  const { dbName, name, hasValue } = measurement;
  const { TripId: tripId, TaskId: taskId } = meta;

  console.log('Querying measurement: ', name, '\nTaskId: ', taskId);

  const { data } = await asyncPost<BoundedPath>('/rides/ride', {
    tripId,
    dbName,
  });

  const { path } = data;

  console.log(
    'Got data for ride: ',
    taskId,
    '\nLength: ',
    path.length,
    '\nMeasurement: ',
    name,
    '\nHasValue?: ',
    hasValue,
  );

  // Track position and (interpolation) has special exceptions since
  // they are supposed to not have any values
  if (hasValue && path.filter((p) => p.value !== undefined).length === 0) {
    toast({
      title: `This trip doesn't contain data for ${name}`,
      footer: `TripId: ${tripId} | TaskId: ${taskId}`,
    });

    return undefined;
  }

  /*if (path.some((p) => p.value === undefined)) {
    popup({
      icon: 'warning',
      title: `This trip is missing some data for ${name}`,
      footer: `TripId: ${tripId} | TaskId: ${taskId}`,
      toast: true,
    });
  }*/

  return data;
};
