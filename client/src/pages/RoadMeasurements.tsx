import React, { FC } from 'react';

import { MeasurementsProvider } from '../context/MeasurementsContext';
import { MetasProvider } from '../context/MetasContext';

import RideDetails from '../Components/RoadMeasurements/RideDetails';
import RideCards from '../Components/RoadMeasurements/RideCards';
import Rides from '../Components/RoadMeasurements/Rides';
import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';

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
        type: 'tabset',
        weight: 60,
        children: [
          {
            type: 'tab',
            name: 'Measurements Map',
            component: 'rides',
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
    }
  }; /*

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
        <div className="rides-wrapper">
          <Layout model={model} factory={factory} />
        </div>
      </MetasProvider>
    </MeasurementsProvider>
  );
};

export default RoadMeasurements;
