import { FC } from "react";
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';

import Navbar from './Components/Navbar'
import Rides from './Components/Rides/Rides'
import SignUpForm from './Components/Login/SignUpForm'
import LiRAMain from './Components/Pages/LiraMain/LiRAMain'

import "./App.css";



const App: FC = () => {
    /*
    <div className="map-wrapper">
          { data === undefined ? <></> : <Map roadStatus={data}/> }
    </div>*/

    return (
        <div className="App">
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={() => <LiRAMain />} />
                    <Route exact path="/rides" component={() => <Rides />} />
                    <Route exact path="/other" component={() => <div>chocolat</div>} />
                    <Route exact path="/login" component={() => <SignUpForm />} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;