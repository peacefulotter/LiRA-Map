import React, { useState } from 'react';
import { Palette } from 'react-leaflet-hotline';
import { ChartData } from 'chart.js';

import ConditionsMap from '../Components/RoadConditions/ConditionsMap';
import ConditionsGraph from '../Components/RoadConditions/ConditionsGraph';

import { ConditionType } from '../models/graph';

import '../css/road_conditions.css';
import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react';
import { GeneralGraphProvider } from '../context/GeneralGraphContext';

const json: IJsonModel = {
  global: { tabEnableFloat: true },
  borders: [],
  layout: {
    type: 'row',
    children: [
      {
        type: 'row',
        children: [
          {
            type: 'tabset',
            children: [
              {
                type: 'tab',
                name: 'Conditions Map',
                component: 'conditionsMap',
              },
            ],
          },
          {
            type: 'tabset',
            children: [
              {
                type: 'tab',
                name: 'Conditions Graph',
                component: 'conditionsGraph',
              },
            ],
          },
        ],
      },
    ],
  },
};

const model = Model.fromJson(json);

const RoadConditions = () => {
  const [palette, setPalette] = useState<Palette>([]);
  const [wayData, setWayData] = useState<ChartData<'line', number[], number>>();

  const factory = (node: TabNode) => {
    const component = node.getComponent();

    if (component === 'conditionsMap') {
      return (
        <ConditionsMap
          type={type}
          palette={palette}
          setPalette={setPalette}
          setWayData={setWayData}
        />
      );
    } else if (component === 'conditionsGraph') {
      return <ConditionsGraph type={type} palette={palette} data={wayData} />;
    }
  };

  const type: ConditionType = {
    name: 'IRI',
    min: 0,
    max: 10,
    grid: true,
    samples: 40,
  };

  return (
    <GeneralGraphProvider>
      <div className="road-conditions-wrapper">
        <Layout model={model} factory={factory} />
      </div>
    </GeneralGraphProvider>
  );
};

export default RoadConditions;
