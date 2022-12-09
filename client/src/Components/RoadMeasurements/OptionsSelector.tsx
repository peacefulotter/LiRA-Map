import React, { FC, useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import { TripsOptions } from '../../models/models';
import { ActiveMeasProperties, DeviceProperties } from '../../models/properties';
import { getDevices } from '../../queries/devices';
import { v4 as uuidv4 } from 'uuid';
import Checkbox from '../Checkbox';

interface IOptionsSelector {
  onChange: (options: TripsOptions) => void;
  defaultOptions: TripsOptions;
}
const OptionsSelector: FC<IOptionsSelector> = ({
  onChange,
  defaultOptions,
}) => {
  const [state, setState] = useState(defaultOptions);
  const [options, setOptions] = useState<TripsOptions>(defaultOptions);
  const [availableDevices, setDevice] = useState<DeviceProperties[]>();
  const { dbName } = state;

  useEffect(() => {
    getDevices((data: DeviceProperties[]) => {
      data.forEach(function (value) {
        setDevice(data);
      });
    });
  }, []);

  const update = (key: keyof ActiveMeasProperties) => (val: any) => {
    const temp = { ...state } as any;
    temp[key] = val;
    setState(temp);
    setOptions(temp);
    temp.id = uuidv4();
  };

  const deviceChange =
  (key: keyof ActiveMeasProperties) =>
  ({ value }: any) =>
    update(key)(value);

  const deviceOptions = availableDevices?.map((device) => ({
    value: device.DeviceId.toString(),
    label:
      device.DeviceId.toString()
  }));

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
      <div id="spacing"></div>
      <div id="menuToggle">
        <input className="menuCheck" type="checkbox" />

        <span className="hamburger"></span>
        <span className="hamburger"></span>
        <span className="hamburger"></span>

        <ul id="menu">
          <div id="ride-search-menu">
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
              <Select
                className="react-select-combobox-filter"
                placeholder="Devices.."
                value={dbName ? { value: dbName, label: dbName } : undefined}
                onChange={deviceChange('dbName')}
                options={deviceOptions}
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
      <div id="spacing"></div>
      <div id="spacing"></div>
    </div>
  );
};

export default OptionsSelector;
