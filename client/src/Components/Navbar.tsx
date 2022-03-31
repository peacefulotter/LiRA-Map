import { FC } from "react";
import { NavLink } from 'react-router-dom';


import '../css/navbar.css';

interface NavBtnProps {
    to: string;
    name: string;
}

const NavBtn: FC<NavBtnProps> = ( { to, name } ) => {
    return (
        <NavLink 
            className='nav-tab' 
            activeClassName="nav-tab-active" 
            to={to}
        >
            { name }
        </NavLink>
    )
}

const Rides: FC = () => {
    return (
        <div className="nav-wrapper">
            <div className="nav-container">
                <div className="nav-block">
                    <NavBtn  to='/rides' name='RIDES' />
                    <NavBtn  to='/ml' name='ML' />
                </div>
                <div className="nav-block">
                    <NavBtn  to='/login' name='LOGIN' />
                </div>
            </div>
        </div>
    )
}

export default Rides;
