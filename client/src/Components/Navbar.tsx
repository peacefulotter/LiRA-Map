import { FC } from "react";
import { NavLink } from 'react-router-dom';

import { Nav } from "../models/nav";

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

interface INavbar {
    routes: Nav[];
}

const Navbar: FC<INavbar> = ( { routes } ) => {
    return (
        <div className="nav-wrapper">
            <div className="nav-container">
                <div className="nav-block">
                    { routes.map( ([path, _, name], i) => 
                        <NavBtn key={`navbtn-${i}`} to={path} name={name} />
                    ) }
                </div>
                <div className="nav-block">
                    <NavBtn  to='/login' name='Login' />
                </div>
            </div>
        </div>
    )
}

export default Navbar;
