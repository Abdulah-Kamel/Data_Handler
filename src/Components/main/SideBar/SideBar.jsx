import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeMenu, setActiveMenu] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  useEffect(() => {    
    setUserRole(JSON.parse(sessionStorage.getItem("User"))?.role);
    const activeItem = menuItems.find((item) => item.to === currentPath);
    if (activeItem) {
      setActiveMenu(activeItem.label);
    }
  }, [activeMenu, currentPath]);

  const menuItems = [
    {
      icon: "fa-solid fa-folder-open",
      label: "تصنيفات",
      isActive: true,
      to: "/dashboard",
    },
    {
      icon: "fa-solid fa-users",
      label: "بيانات مجمعه",
      to: "/dashboard/bulk-data",
    },
    {
      icon: "fa-solid  fa-file-alt",
      label: "ملئ القوالب",
      to: "/dashboard/FilledTemplet",
    },
    userRole === "admin" && {
      icon: "fa-solid fa-user",
      label: "المستخدمين",
      to: "/dashboard/users",
    },
  ];
  const handleLogout = () => {
    sessionStorage.removeItem("User");
    navigate("/login");
  };

  return (
    <div
      className="offcanvas offcanvas-end"
      tabindex="-1"
      id="offcanvasNavbar"
      aria-labelledby="offcanvasNavbarLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title fw-bold fs-4" id="offcanvasNavbarLabel">
          Dashboard
        </h5>
        <button
          type="button"
          className="btn-close me-auto ms-0"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body d-flex flex-column justify-content-between">
        <ul className="navbar-nav justify-content-end pe-3">
          {menuItems.map((item, index) => (
            <li className="nav-item">
              <Link
                key={index}
                to={`${item.to}`}
                className={`d-flex fs-5 rounded-2 mb-2 align-items-center px-4 py-2 text-decoration-none ${
                  item.isActive
                    ? "bg-success text-white"
                    : "text-secondary hover-success"
                }`}
              >
                <i className={`${item.icon}`}></i>
                <span className="me-2 small fw-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
           <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-danger w-100 d-flex justify-content-center align-items-center "
              onClick={handleLogout}
            >
              تسجيل خروج
              <i className="fa-solid fa-right-from-bracket fs-4"></i>
            </button>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
