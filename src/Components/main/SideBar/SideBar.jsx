import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  // Add useEffect to handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsCollapsed]);

  const menuItems = [
    {
      icon: "fa-solid fa-folder-open",
      label: "تصنيفات",
      isActive: true,
      to: "/dashboard",
    },
    { icon: "fa-solid fa-users", label: "بيانات مجمعه", to: "/dashboard/bulk-data" },
    // { icon: 'fa-solid fa-message', label: 'Message' },
    // { icon: 'fa-solid fa-gear', label: 'Settings' },
    // { icon: 'fa-solid fa-circle-question', label: 'Help' },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "col-1" : "col-2"
      } p-0 vh-100 bg-white border-end d-flex flex-column transition-width`}
    >
      {/* Logo Section */}
      <div className="p-4 text-center primary-bg d-flex justify-content-between align-items-center">
        {!isCollapsed && (
          <span className="fs-4 fw-semibold text-dark">Data Handler</span>
        )}
        <button
          className="btn btn-link p-0 border-0 text-dark"
          onClick={() => {
            // Only allow uncollapsing if screen width is >= 768px
            if (isCollapsed && window.innerWidth < 768) {
              return; // Do nothing on small screens when collapsed
            }
            setIsCollapsed(!isCollapsed);
          }}
        >
          <i
            className={`fa-solid ${
              isCollapsed ? "fa-caret-right" : "fa-caret-left"
            }`}
          ></i>
        </button>
      </div>

      {/* Rest of the component remains unchanged */}
      <nav className="flex-grow-1 d-flex flex-column pt-3 px-3">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={`${item.to}`}
            className={`d-flex fs-5 rounded-2 mb-2 align-items-center ${
              isCollapsed ? "justify-content-center" : ""
            } px-4 py-2 text-decoration-none ${
              item.isActive
                ? "bg-success text-white"
                : "text-secondary hover-success"
            }`}
          >
            <i className={`${item.icon}`}></i>
            {!isCollapsed && (
              <span className="me-2 small fw-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-top">
        <a
          href="#"
          className={`d-flex align-items-center ${
            isCollapsed ? "justify-content-center" : ""
          } text-secondary text-decoration-none`}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          {!isCollapsed && (
            <span className="me-2 small fw-medium">Log Out</span>
          )}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
