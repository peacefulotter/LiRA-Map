import React, { FC, useEffect, useState } from 'react';
import { ActiveMeasProperties } from '../models/properties';

import { useMeasurementsCtx } from '../../context/MeasurementsContext';
import { MeasMetaPath } from '../../models/path';
import { addMeasurement, getMeasurement } from '../../queries/measurements';




const [measurement, setMeasurement] = useState<ActiveMeasProperties>({});

const RPM_Front_Right = "obd.rpm_fr";
const RPM_Rear_Right = "obd.rpm_rr";
const Car_Velocity = "obd.spd_veh";

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
  
  const mu_value = (Math.log((beta_front_right * wheel_radius)/(wheel_radius * rpm_fr - spd_veh)) + 1)
  return addMeasurement(mu_value);
}
)
 
  return ( 
    
  )
}

