import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideBar = ({isCollapsed, setIsCollapsed}) => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    
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
        <aside className={`col-2  shadow-lg border-start border-2 sidebar p-0 transition-width`}>
            <div className="top-sidebar p-4 border-bottom border-3 position-relative" style={{backgroundColor:"#05755C"}}>
                {!isCollapsed && <h4 className="text-center text-white fw-bold w-100">Emailer</h4>}
                {/* <button 
                    className="btn btn-link text-white position-absolute end-0 me-2 top-50 translate-middle-y"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{ background: 'none', border: 'none' }}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <i className={`fas fa-arrow-${isCollapsed ? 'right' : 'left'} fs-5`}></i>
                </button> */}
            </div>
            <ul className="nav flex-column align-items-center px-2 mt-3 w-100">
                <li className={`nav-item py-2 nav-bg mt-3 w-100 ${isCollapsed ? 'text-center' : 'text-start'} active`}>
                    <Link to="/dashboard" className="nav-link text-white fw-bold d-flex align-items-center justify-content-center">
                        <i className="fa-solid fa-layer-group text-white fa-xl"></i>
                        {!isCollapsed && <span className="ms-2">Categories</span>}
                    </Link>
                </li>
                {/* <li className={`nav-item py-2 mt-3 w-100 ${isCollapsed ? 'text-center' : 'text-start'}`}>
                    <a role={"button"}
                        className={`btn py-3 nav-bg text-black fw-bold text-decoration-none d-flex align-items-center justify-content-center ${isActiveSection('/settings') ? 'active' : ''}`}
                        onClick={toggleDropdown}
                    >
                        <i className="fa-solid fa-gear text-success"></i>
                        {!isCollapsed && <span className="ms-2">Settings <i className="fa-solid fa-caret-down ms-1"></i></span>}
                    </a>

                    {openDropdown && !isCollapsed && (
                        <ul className="nav flex-column align-items-center pe-0 w-100">
                            <li className="nav-item py-2 nav-bg mt-3">
                                <Link to="/settings/account" className={`nav-link text-black fw-bold ${isActive('/settings/account')}`}>Account</Link>
                            </li>
                            <li className="nav-item py-2 nav-bg mt-3">
                                <Link to="/settings/privacy" className={`nav-link text-black fw-bold ${isActive('/settings/privacy')}`}>Privacy</Link>
                            </li>
                        </ul>
                    )}
                </li> */}
            </ul>
        </aside>
    );
};

export default SideBar;
