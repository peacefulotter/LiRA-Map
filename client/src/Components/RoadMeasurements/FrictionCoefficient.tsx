import React, { FC, useEffect, useState } from 'react';
import { ActiveMeasProperties } from '../models/properties';

import { useMeasurementsCtx } from '../../context/MeasurementsContext';
import { MeasMetaPath } from '../../models/path';
import { addMeasurement, getMeasurement } from '../../queries/measurements';




const [measurement, setMeasurement] = useState<ActiveMeasProperties>({});

const RPM_Front_Right = "obd.rpm_fr";
const RPM_Rear_Right = "obd.rpm_rr";
const Car_Velocity = "obd.spd_veh";
const RPM_Front_Left = "obd.rpm_fl";
const RPM_Rear_Left = "obd.rpm_rl";

const beta_front_right = 3 ;
const beta_zero = 1;
const wheel_radius = 0.31;

const chooseMeasurement: ActiveMeasProperties = (dbName:string) => {
  getMeasurement((data) => {
    setMeasurement(data);
  }, dbName) 
}

export const mu_function = () => {
  

  useEffect(() => {
  const rpm_fr = chooseMeasurement(RPM_Front_Right) 
  const rpm_rr = chooseMeasurement(RPM_Rear_Right)
  const spd_veh = chooseMeasurement(Car_Velocity)
  const rpm_fl = chooseMeasurement(RPM_Front_Left) 
  const rpm_rl = chooseMeasurement(RPM_Rear_Left)
  
  const mu_right_value = (Math.log((beta_front_right * wheel_radius)/(wheel_radius * rpm_fr - spd_veh)) + 1)
  const mu_left_value = (Math.log((beta_front_right * wheel_radius)/(wheel_radius * rpm_fl - spd_veh)) + 1)
  const mu_value = (mu_left_value+mu_right_value)/2
  return writefile(mu_value);
  }
  )
 
  return ( 
    
  )
}

function writefile(mu_value: number): void | (() => void | { [UNDEFINED_VOID_ONLY]: never; }) {
  throw new Error('Function not implemented.');
}

