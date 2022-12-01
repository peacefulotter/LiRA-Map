import React, { FC, useEffect, useState } from 'react';

import { useMeasurementsCtx } from '../../context/MeasurementsContext';
import { GraphProvider } from '../../context/GraphContext';
import { useMetasCtx } from '../../context/MetasContext';

import { Bounds, MeasMetaPath, Path, PointData } from '../../models/path';

import { GraphData, GraphPoint } from '../../assets/graph/types';

import { getRide } from '../../queries/rides';

import Graph from '../Graph/Graph';
import RidesMap from './RidesMap';
import useToast from '../createToast';
import Loading from '../Loading';
import GraphSelector from '../Graph/GraphSelector';

const Rides: FC = () => {
  return (
    <GraphProvider>
      <div className="map-container">
        <RidesMap />
        <GraphSelector />
        <Graph />
      </div>
    </GraphProvider>
  );
};

export default Rides;
