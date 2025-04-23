import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
    const [openDropdown, setOpenDropdown] = useState(false);

    const toggleDropdown = () => {
        setOpenDropdown(!openDropdown);
    };

    return (
        <aside className="col-md-2 col-3 shadow-lg border-start border-2 sidebar">
            <h4 className="text-center mt-5 fw-bold border-bottom border-3 pb-2 w-100">Menu</h4>
            <ul className="nav flex-column align-items-center pe-0 mt-3 w-100">
                <li className="nav-item nav-bg mt-3 w-100 text-center">
                    <Link to="/dashboard/categories" className="nav-link text-black fw-bold">Categories</Link>
                </li>
                <li className="nav-item nav-bg mt-3 w-100 text-center">
                    <Link to="/dashboard/templets" className="nav-link text-black fw-bold">Templets</Link>
                </li>

                <li className="nav-item mt-3 w-100 text-center">
                    <a role={"button"}
                        className="btn nav-bg text-black fw-bold text-decoration-none"
                        onClick={toggleDropdown}
                    >
                         <i className="fa-solid fa-caret-down"></i> Settings
                    </a>

                    {openDropdown && (
                        <ul className="nav flex-column align-items-center pe-0 w-100">
                            <li className="nav-item nav-bg mt-3">
                                <Link to="/settings/account" className="nav-link text-black fw-bold">Account</Link>
                            </li>
                            <li className="nav-item nav-bg mt-3">
                                <Link to="/settings/privacy" className="nav-link text-black fw-bold">Privacy</Link>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </aside>
    );
};

export default SideBar;
