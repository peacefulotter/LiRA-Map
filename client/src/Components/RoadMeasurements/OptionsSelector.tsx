import React, { FC, useState } from 'react';
import DatePicker from 'react-date-picker';
import { TripsOptions } from '../../models/models';
import Checkbox from '../Checkbox';

const defaultOptions: TripsOptions = {
  taskId: '',
  startDate: new Date('2020-01-01'),
  endDate: new Date(),
  reversed: false,
  distanceKm: undefined,
  startCity: '',
  endCity: '',
  postalCode: undefined,
};
interface IOptionsSelector {
  onChange: (options: TripsOptions) => void;
}
const OptionsSelector: FC<IOptionsSelector> = ({ onChange }) => {
  const [options, setOptions] = useState<TripsOptions>(defaultOptions);

  const _onChange = (key: keyof TripsOptions) => {
    return function <T>(value: T) {
      const temp = { ...options } as any;
      temp[key] = value;
      console.log('🇩🇰', temp);
      setOptions(temp);
      onChange(temp);
    };
  };

  return (
    <div className="rides-options">
      <input
        className="ride-search-input"
        placeholder="TaskID"
        value={options.taskId}
        onChange={(e) => _onChange('taskId')(e.target.value)}
      />

      <input
        className="ride-search-input"
        placeholder="Distance Km"
        value={options.distanceKm}
        onChange={(e) => _onChange('distanceKm')(e.target.value)}
      />

      <DatePicker
        onChange={_onChange('startDate')}
        value={options.startDate}
        className="options-date-picker"
      />
      <DatePicker
        onChange={_onChange('endDate')}
        value={options.endDate}
        className="options-date-picker"
      />

      <Checkbox
        className="ride-sort-cb"
        html={<div>Sort {options.reversed ? '▼' : '▲'}</div>}
        onClick={_onChange('reversed')}
      />
    </div>
  );
};

export default OptionsSelector;

/*
The remaining inputs that are missing functions.
<input
        className="ride-search-input"
        placeholder="Start City"
        value={options.startCity}
        onChange={(e) => _onChange('startCity')(e.target.value)}
      />
      <input
        className="ride-search-input"
        placeholder="Destination City"
        value={options.endCity}
        onChange={(e) => _onChange('endCity')(e.target.value)}
      />
      <input
        className="ride-search-input"
        placeholder="Postal Code"
        value={options.postalCode}
        onChange={(e) => _onChange('postalCode')(e.target.value)}
      />
*/
