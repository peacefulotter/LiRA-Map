/** @author Benjamin Lumbye s204428 */

import React, { FC } from 'react';
import { GraphProvider } from '../../context/GraphContext';

import Graph from '../Graph/Graph';
import RidesMap from './RidesMap';
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
