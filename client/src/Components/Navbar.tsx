import { FC } from "react";
import { NavLink } from 'react-router-dom';


import '../css/navbar.css';



const Rides: FC = () => {
        
    return (
        <div className="nav-wrapper">
            <div className="nav-container">
                <div className="nav-block">
                    <NavLink className="nav-tab" activeClassName="nav-tab-active" to="/rides">RIDES</NavLink>
                    <NavLink className="nav-tab" activeClassName="nav-tab-active" to="/other">OTHER</NavLink>
                </div>
                <div className="nav-block">
                    <NavLink className="nav-tab right-tab" activeClassName="nav-tab-active" to="/login">LOGIN</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Rides;
