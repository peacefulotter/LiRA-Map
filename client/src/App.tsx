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

const App: FC = () => {
  return (
    <div className="App">
      <Router>
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
        <Toaster containerStyle={{ zIndex: 999999 }} />
      </Router>
    </div>
  );
};

export default App;
