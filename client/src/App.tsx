import { FC } from "react";
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';

import Navbar from './Components/Navbar'
import Trips from "./pages/Trips";
import ML from "./pages/ML";
import CarData from "./pages/CarData";
import Login from "./pages/Login";

import "./App.css";

const App: FC = () => {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/cardata" component={() => <CarData />} />
                    <Route exact path="/rides" component={() => <Trips />} />
                    <Route exact path="/ml"    component={() => <ML />} />
                    <Route exact path="/login" component={() => <Login />} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;