import React, { FC } from 'react';

import { MeasurementsProvider } from '../context/MeasurementsContext';
import { MetasProvider } from '../context/MetasContext';

import RideDetails from '../Components/RoadMeasurements/RideDetails';
import RideCards from '../Components/RoadMeasurements/RideCards';
import Rides from '../Components/RoadMeasurements/Rides';
import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';
import { GraphProvider } from '../context/GraphContext';
import RidesMap from '../Components/RoadMeasurements/RidesMap';
import Graph from '../Components/Graph/Graph';
import GraphSelector from '../Components/Graph/GraphSelector';
import { GeneralGraphProvider } from '../context/GeneralGraphContext';

const json: IJsonModel = {
  global: { tabEnableFloat: true },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 18,
        children: [
          {
            type: 'tab',
            name: 'Trips',
            component: 'ridecards',
          },
        ],
      },
      {
        type: 'tabset',
        weight: 22,
        children: [
          {
            type: 'tab',
            name: 'Measurements',
            component: 'ridedetails',
          },
        ],
      },
      {
        type: 'row',
        weight: 60,
        children: [
          {
            type: 'tabset',
            weight: 65,
            children: [
              {
                type: 'tab',
                name: 'Measurements Map',
                component: 'ridemap',
              },
            ],
          },
          {
            type: 'tabset',
            weight: 35,
            children: [
              {
                type: 'tab',
                name: 'Graph',
                component: 'graph',
              },
            ],
          },
        ],
      },
    ],
  },
};

const model = Model.fromJson(json);

const RoadMeasurements = () => {
  const factory = (node: TabNode) => {
    const component = node.getComponent();

    if (component === 'rides') {
      return <Rides />;
    } else if (component === 'ridecards') {
      return <RideCards />;
    } else if (component === 'ridedetails') {
      return <RideDetails />;
    } else if (component === 'ridemap') {
      return <RidesMap />; //;
    } else if (component === 'graph') {
      return (
        <>
          <GraphSelector />
          <Graph />
        </>
      ); //;
    }
  };

  /*
    
                                          return (
                                            <MeasurementsProvider>
                                              <MetasProvider>
                                                <div className="rides-wrapper">
                                                  <RideCards />
    
                                                  <RideDetails />
    
                                                  <Rides />
                                                </div>
                                              </MetasProvider>
                                            </MeasurementsProvider>
                                          );
    
                                           */

  return (
    <MeasurementsProvider>
      <MetasProvider>
        <GeneralGraphProvider>
          <GraphProvider>
            <div className="rides-wrapper">
              <Layout model={model} factory={factory} />
            </div>
          </GraphProvider>
        </GeneralGraphProvider>
      </MetasProvider>
    </MeasurementsProvider>
  );
};

export default RoadMeasurements;
