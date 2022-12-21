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
import help_icon from './icons8-question-mark-64.png'; //source: https://icons8.com/icon/80684/question-mark

/*@author Matteo Hoffmann s222952*/
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
            helpText:
              'All available trips can be found here. Click a trip to select it. When both a trip and a measurement type is selected they will be shown on the Measurements Map and the Graph.',
            icon: help_icon,
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
            helpText:
              'Types of measurements that may be collected during trips are found here. Click a measurement type to select it. When both a trip and a measurement type is selected they will be shown on the Measurement Map and the Graph',
            icon: help_icon,
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
                helpText:
                  'The selected trips and their measurements are shown here. If multiple measurement types are selected the measurement type shown in the Graph is also the measurement type shown here.',
                icon: help_icon,
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
                helpText:
                  'Measurements collected during a trip are shown here. The comboboxes lets you choose a combination from the selected trips and measurement types.',
                icon: help_icon,
              },
            ],
          },
        ],
      },
    ],
  },
};

const model = Model.fromJson(json);

/*@author Matteo Hoffmann s222952*/
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
      );
    }
  };

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
