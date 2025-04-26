import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: 'fa-solid fa-folder-open', label: 'تصنيفات', isActive: true },
    { icon: 'fa-solid fa-users', label: 'قوالب' },
    // { icon: 'fa-solid fa-message', label: 'Message' },
    // { icon: 'fa-solid fa-gear', label: 'Settings' },
    // { icon: 'fa-solid fa-circle-question', label: 'Help' },
  ];

  return (
    <div className="col-2 p-0 vh-100 bg-white border-end d-flex flex-column">
      {/* Logo Section */}
      <div className="p-4 text-center primary-bg">
          <span className="fs-4 fw-semibold text-dark">Data Handler</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow-1 d-flex flex-column pt-3 px-3">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href="#"
            className={`d-flex fs-5 rounded-2 mb-2 align-items-center px-4 py-2 text-decoration-none ${
              item.isActive ? 'bg-success text-white' : 'text-secondary hover-success'
            }`}
          >
            <i className={`${item.icon}`}></i>
            <span className="me-2 small fw-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-top">
        <a
          href="#"
          className="d-flex align-items-center text-secondary text-decoration-none"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="me-2 small fw-medium">Log Out</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;