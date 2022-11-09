import Checkbox from '../Checkbox';
import React from 'react';
import DatePicker from 'react-date-picker';
import { TripsOptions } from '../../models/models';
import '../../css/searchoptioninterface.css';

const contracted = true;
const defaultOptions: TripsOptions = {
  taskId: '',
  startDate: new Date(),
  endDate: new Date(),
  reversed: false,
  distanceKm: undefined,
  postalCode: undefined,
  startCity: '',
  endCity: '',
};

console.log('🇩🇰', contracted);
export const SearchOptionInterface = () => {
  return (
    <DatePicker
      onChange={() => console.log('dagar')}
      value={defaultOptions.startDate}
      className="options-date-picker"
    />
  );
};
