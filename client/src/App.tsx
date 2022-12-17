import React, { FC } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './Components/Navbar';
import RoadMeasurements from './pages/RoadMeasurements';
import RoadConditions from './pages/RoadConditions';
import Altitude from './pages/Altitude';
import CarData from './pages/CarData';
import Login from './pages/Login';

import './App.css';
import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react';
import Rides from './Components/RoadMeasurements/Rides';
import RideCards from './Components/RoadMeasurements/RideCards';
import RideDetails from './Components/RoadMeasurements/RideDetails';

// @author Matteo Hoffmann s222952
const json: IJsonModel = {
  global: { tabEnableFloat: true },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 100,
        children: [
          {
            type: 'tab',
            name: 'Road Measurements',
            component: 'roadMeasurements',
          },
          {
            type: 'tab',
            name: 'Road Conditions',
            component: 'roadConditions',
          },
          {
            type: 'tab',
            name: 'Cardata',
            component: 'carData',
          },
          {
            type: 'tab',
            name: 'Altitude',
            component: 'altitude',
          },
        ],
      },
    ],
  },
};

const model = Model.fromJson(json);

const App: FC = () => {
  // @author Matteo Hoffmann s222952
  const factory = (node: TabNode) => {
    const component = node.getComponent();

    if (component === 'roadMeasurements') {
      return <RoadMeasurements />;
    } else if (component === 'roadConditions') {
      return <RoadConditions />;
    } else if (component === 'carData') {
      return <CarData />;
    } else if (component === 'altitude') {
      return <Altitude />;
    }
  };

  if (window.opener && window.opener !== window) {
    // you are in a popup
    return null;
  }

  return (
    <div className="App">
      <Router>
        {
          // @author Matteo Hoffmann s222952
        }
        <Layout model={model} factory={factory} />

        <Toaster containerStyle={{ zIndex: 999999 }} />
      </Router>
    </div>
  );
};

export default App;
