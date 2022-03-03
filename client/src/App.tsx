import { FC } from "react";
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';

import Navbar from './Components/Navbar'
import Rides from './Components/Rides/Rides'
import SignUpForm from './Components/Login/SignUpForm'
import LiRAMain from './Components/Pages/LiraMain/LiRAMain'
import ML from "./Components/Machine/ML";

import "./App.css";



const App: FC = () => {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={() => <LiRAMain />} />
                    <Route exact path="/rides" component={() => <Rides />} />
                    <Route exact path="/ml"    component={() => <ML />} />
                    <Route exact path="/login" component={() => <SignUpForm />} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;