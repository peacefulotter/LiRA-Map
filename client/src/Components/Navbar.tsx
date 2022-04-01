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
            { name.toUpperCase() }
        </NavLink>
    )
}

const Navbar: FC = () => {
    return (
        <div className="nav-wrapper">
            <div className="nav-container">
                <div className="nav-block">
                    <NavBtn  to='/rides' name='rides' />
                    <NavBtn  to='/ml' name='ml' />
                    <NavBtn  to='/cardata' name='cardata' />
                </div>
                <div className="nav-block">
                    <NavBtn  to='/login' name='login' />
                </div>
            </div>
        </div>
    )
}

export default Navbar;
