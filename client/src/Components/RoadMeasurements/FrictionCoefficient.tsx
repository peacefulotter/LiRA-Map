import React, { FC, useEffect, useState } from 'react';
import { MeasProperties, ActiveMeasProperties } from '../models/properties';
import { get, put } from './fetch';
import { useMeasurementsCtx } from '../../context/MeasurementsContext';
import { useMetasCtx } from '../../context/MetasContext';

import { ActiveMeasProperties } from '../../models/properties';
import { MeasMetaPath, PointData } from '../../models/path';

import { GraphData, GraphPoint } from '../../assets/graph/types';


import { getMeasurements } from '../../queries/measurements';

const [paths, setPaths] = useState<MeasMetaPath>({});




type RPM_Unit = rev/minute
const beta_front_right = 3 rev/min;
const beta_zero = 1;
const wheel_radius = 0.31 meter;


const { RPM_Front_Right, RPM_Rear_Right, Car_Velocity } = getMeasurements();

interface mu {
  RPM_Front_Right: any,
  RPM_Rear_Right,
  Car_Velocity
}

const mu_function: mu = ({
  RPM_Front_Right,
  RPM_Rear_Right,
  Car_Velocity
}) => {
  return (
    (ln((beta_front_right * wheel_radius)/(wheel_radius * RPM_Front_Right - Car_Velocity)) + 1)


  )
}*/

