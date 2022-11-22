import React, { FC, useState } from 'react';
import DatePicker from 'react-date-picker';
import { TripsOptions } from '../../models/models';
import Checkbox from '../Checkbox';

interface IOptionsSelector {
  onChange: (options: TripsOptions) => void;
  defaultOptions: TripsOptions;
}
const OptionsSelector: FC<IOptionsSelector> = ({
  onChange,
  defaultOptions,
}) => {
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
    <div>
      <div className="rides-options">
        <input
          className="ride-search-input"
          placeholder="TaskID"
          value={options.taskId}
          onChange={(e) => _onChange('taskId')(e.target.value)}
        />
      </div>
      <div id = "spacing"></div>
      <div id="menuToggle">
      <input className ="menuCheck"type="checkbox" />
      
      <span className="hamburger"></span>
      <span className="hamburger"></span>
      <span className="hamburger"></span>
      
      <ul id="menu">
        <div id = "ride-search-menu">
          <li>
            <input
              className="ride-search-input"
              placeholder="Min Distance Km"
              value={options.minDistanceKm}
              onChange={(e) => _onChange('minDistanceKm')(e.target.value)}
            />
          </li>
          <li>
            <input
              className="ride-search-input"
              placeholder="Max Distance Km"
              value={options.maxDistanceKm}
              onChange={(e) => _onChange('maxDistanceKm')(e.target.value)}
            />
          </li>
          <li>
            <input
              className="ride-search-input"
              placeholder="Start City"
              value={options.startCity}
              onChange={(e) => _onChange('startCity')(e.target.value)}
            />
          </li>
          <li>
            <input
              className="ride-search-input"
              placeholder="Destination City"
              value={options.endCity}
              onChange={(e) => _onChange('endCity')(e.target.value)}
            />
          </li>
          <li>
            <DatePicker
              onChange={_onChange('startDate')}
              value={options.startDate}
              className="options-date-picker"
              format="dd/MM/y"
            />
          </li>
          <li>
            <DatePicker
              onChange={_onChange('endDate')}
              value={options.endDate}
              className="options-date-picker"
              format="dd/MM/y"
            />
          </li>
          <li>
            <Checkbox
              className="ride-sort-cb"
              html={<div>Sort {options.reversed ? '▼' : '▲'}</div>}
              onClick={_onChange('reversed')}
            />
          </li>
        </div>
      </ul>
    </div>
  </div>
  );
};

export default OptionsSelector;

