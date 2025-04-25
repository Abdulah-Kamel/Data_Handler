import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    console.log(currentPath);
    

    const toggleDropdown = () => {
        setOpenDropdown(!openDropdown);
    };

    // Check if the current path matches the link path
    const isActive = (path) => {
        return currentPath === path ? 'active' : '';
    };

    // Check if current path starts with a specific prefix (for dropdown items)
    const isActiveSection = (prefix) => {
        return currentPath.startsWith(prefix) ? true : false;
    };

    return (
        <aside className="col-md-2 d-none d-md-block  shadow-lg border-start border-2 sidebar">
            <h4 className="text-center mt-5 fw-bold border-bottom border-3 pb-2 w-100">Menu</h4>
            <ul className="nav flex-column align-items-center pe-0 mt-3 w-100">
                <li className={`nav-item nav-bg mt-3 w-100 text-cente  ${isActive('/dashboard')}`}>
                    <Link to="/dashboard" className="nav-link text-black fw-bold">Categories</Link>
                </li>
                <li className="nav-item mt-3 w-100 text-center">
                    <a role={"button"}
                        className={`btn nav-bg text-black fw-bold text-decoration-none ${isActiveSection('/settings') ? 'active' : ''}`}
                        onClick={toggleDropdown}
                    >
                         <i className="fa-solid fa-caret-down"></i> Settings
                    </a>

                    {openDropdown && (
                        <ul className="nav flex-column align-items-center pe-0 w-100">
                            <li className="nav-item nav-bg mt-3">
                                <Link to="/settings/account" className={`nav-link text-black fw-bold ${isActive('/settings/account')}`}>Account</Link>
                            </li>
                            <li className="nav-item nav-bg mt-3">
                                <Link to="/settings/privacy" className={`nav-link text-black fw-bold ${isActive('/settings/privacy')}`}>Privacy</Link>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </aside>
    );
};

export default SideBar;
