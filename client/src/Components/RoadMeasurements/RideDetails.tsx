import React, { FC, useState } from 'react';

import useMeasPopup from './Popup/useMeasPopup';
import Checkbox from '../Checkbox';
import MetaData from './MetaData';

import { useMeasurementsCtx } from '../../context/MeasurementsContext';
import { useMetasCtx } from '../../context/MetasContext';

import {
  addMeasurement,
  deleteMeasurement,
  editMeasurement,
} from '../../queries/measurements';
import { ActiveMeasProperties } from '../../models/properties';
import { RideMeta } from '../../models/models';

import { RENDERER_MEAS_PROPERTIES } from '../Map/constants';

import MeasCheckbox from './MeasCheckbox';

import { v4 as uuidv4 } from 'uuid';
import '../../css/ridedetails.css';

import '../../css/ridedetails.css';

const RideDetails: FC = () => {
  const { selectedMetas } = useMetasCtx();

  const { measurements, setMeasurements } = useMeasurementsCtx();
  const [addChecked, setAddChecked] = useState<boolean>(false);

  const popup = useMeasPopup();

  const showEditMeasurement =
    (meas: ActiveMeasProperties) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      popup(
        (newMeas: ActiveMeasProperties) => {
          newMeas.id = meas.id;
          const temp = [...measurements];
          temp[temp.findIndex((m) => m.id === newMeas.id)] = newMeas;
          editMeasurement(newMeas);
          setMeasurements(temp);
        },
        { ...RENDERER_MEAS_PROPERTIES, ...meas },
      );
    };

  const showAddMeasurement = () => {
    setAddChecked(true);
    popup(
      (newMeasurement: ActiveMeasProperties) => {
        setAddChecked(false);
        // update the state in RideDetails
        setMeasurements((prev) => [...prev, newMeasurement]);
        // and add the measurement to the measurements.json file
        addMeasurement(newMeasurement);
      },
      { ...RENDERER_MEAS_PROPERTIES, id: uuidv4() },
    );
  };
  const showDeleteMeasurement =
    (m: ActiveMeasProperties) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const tempArray = [...measurements];
      const elementToRemove = m.id;

      const filteredArray = tempArray.filter((m) => m.id !== elementToRemove);
      deleteMeasurement(m);
      setMeasurements(filteredArray);
    };

  const selectMeasurement = (id: string) => (isChecked: boolean) => {
    const temp = [...measurements];
    const selected = temp.find((m) => m.id === id);
    if (selected) selected.isActive = isChecked;
    setMeasurements(temp);
  };

  return (
    <div className="meta-data">
      {measurements.map((m: ActiveMeasProperties) => (
        <MeasCheckbox
          key={`meas-checkbox-${m.id}`}
          meas={m}
          selectMeasurement={selectMeasurement(m.id)}
          editMeasurement={showEditMeasurement(m)}
          deleteMeasurement={showDeleteMeasurement(m)}
        />
      ))}

      <Checkbox
        className="ride-metadata-checkbox md-checkbox-add"
        html={<div>+</div>}
        forceState={addChecked}
        onClick={showAddMeasurement}
      />

      {selectedMetas.map((meta: RideMeta, i: number) => (
        <MetaData md={meta} key={`md-${Math.random()}`} />
      ))}
    </div>
  );
};

export default RideDetails;
