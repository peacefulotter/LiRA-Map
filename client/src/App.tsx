import { FC } from "react";
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';

import Navbar from './Components/Navbar'
import RoadMeasurements from "./pages/RoadMeasurements";
import RoadConditions from "./pages/RoadConditions";
import Altitude from "./pages/Altitude";
import CarData from "./pages/CarData";
import Login from "./pages/Login";

import { Nav } from "./models/nav";

import "./App.css";

const routes: Nav[] = [
    ['/road_measurements', RoadMeasurements, 'Road Measurements'],
    ['/road_conditions', RoadConditions, 'Road Conditions'],
    ['/cardata', CarData, 'Cardata'],
    ['/altitude', Altitude, 'Altitude'],
]

const App: FC = () => {
    return (
        <div className="App">
            <Router>
                <Navbar routes={routes} />
                <Switch>
                    { routes.map( ([path, Component, _], i) =>
                        <Route exact key={`route-${i}`} path={path} component={Component} />
                    ) }
                    <Route exact path='/login' component={Login} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;