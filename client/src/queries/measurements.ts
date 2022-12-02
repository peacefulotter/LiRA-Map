import { MeasProperties, ActiveMeasProperties } from '../models/properties';
import { get, put, _delete } from './fetch';

export const getMeasurements = (
  callback: React.Dispatch<React.SetStateAction<ActiveMeasProperties[]>>,
) => {
  get('/measurements', (data: MeasProperties[]) => {
    console.log(data);
    callback(
      data.map((meas) => {
        return { ...meas, isActive: false };
      }),
    );
  });
};

export const addMeasurement = (measurement: MeasProperties) => {
  put('/measurements/', { measurement });
};

export const editMeasurement = (measurement: MeasProperties) => {
  put(`/measurements/${measurement.id}`, { measurement });
};

export const deleteMeasurement = (measurement: MeasProperties) => {
  _delete(`/measurements/${measurement.id}`);
};
