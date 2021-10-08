import { FC } from "react";
import { NavLink } from 'react-router-dom';


import '../css/navbar.css';



const Rides: FC = () => {
        
    return (
        <div className="nav-wrapper">
            <NavLink className="nav-tab" activeClassName="nav-tab-active" to="/rides">RIDES</NavLink>
            <NavLink className="nav-tab" activeClassName="nav-tab-active" to="/other">OTHER</NavLink>
            <NavLink className="nav-tab" activeClassName="nav-tab-active" to="/login">LOGIN</NavLink>
        </div>
    )
}

export default Rides;
