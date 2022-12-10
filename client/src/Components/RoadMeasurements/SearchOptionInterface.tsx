import Checkbox from '../Checkbox';
import React from 'react';
import DatePicker from 'react-date-picker';
import { TripsOptions } from '../../models/models';
import '../../css/searchoptioninterface.css';

/* @author Mads Møller s184443, Martin Nielsen s174971 */

const contracted = true;
const defaultOptions: TripsOptions = {
  taskId: '',
  startDate: new Date(),
  endDate: new Date(),
  reversed: false,
  minDistanceKm: undefined,
  maxDistanceKm: undefined,
  startCity: '',
  endCity: '',
  deviceId: '',
};


export const SearchOptionInterface = () => {
  return (
    <DatePicker
      value={defaultOptions.startDate}
      className="options-date-picker"
    />
  );
};
