import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import RoadMeasurements from './pages/RoadMeasurements';
import RoadConditions from './pages/RoadConditions';
import Altitude from './pages/Altitude';
import CarData from './pages/CarData';

import './App.css';
import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react';

// @author Benjamin Lumbye s204428, Matteo Hoffmann s222952
const defaultLayout: IJsonModel = {
  global: { tabEnableFloat: true, tabEnableClose: false },
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
          //{
          //  type: 'tab',
          //  name: 'Cardata',
          //  component: 'carData',
          //},
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
const layoutKey = 'app-layout';

const App: FC = () => {
  const [model, setModel] = useState<Model>();

  useEffect(() => {
    const localLayout = localStorage.getItem(layoutKey);
    if (localLayout === null) {
      setModel(Model.fromJson(defaultLayout));
    } else {
      setModel(Model.fromJson(JSON.parse(localLayout)));
    }
  }, []);

  const saveLayout = (newModel: Model) => {
    localStorage.setItem(layoutKey, JSON.stringify(newModel.toJson()));
  };

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
        {/*}
        <Navbar />

        <Switch>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/road_measurements" />}
          />
          <Route exact path="/cardata" component={CarData} />
          <Route exact path="/road_measurements" component={RoadMeasurements} />
          <Route exact path="/road_conditions" component={RoadConditions} />
          <Route exact path="/altitude" component={Altitude} />
          <Route exact path="/login" component={Login} />
        </Switch>
        */}
        {/** @author Matteo Hoffmann s222952 */}
        {model && (
          <Layout model={model} factory={factory} onModelChange={saveLayout} />
        )}

        <Toaster containerStyle={{ zIndex: 999999 }} />
      </Router>
    </div>
  );
};

export default App;
