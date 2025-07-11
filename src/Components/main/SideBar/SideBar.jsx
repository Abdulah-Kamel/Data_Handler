import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    const activeItem = menuItems.find((item) => item.to === currentPath);
    if (activeItem) {
      setActiveMenu(activeItem.label);
    }
  }, [currentPath]);

  const menuItems = [
    {
      icon: "fa-solid fa-users",
      label: t("sidebar.menu.data_management"),
      to: "/dashboard/bulk-data",
    },
    {
      icon: "fa-solid fa-folder-open",
      label: t("sidebar.menu.form_creation"),
      to: "/dashboard",
    },
    {
      icon: "fa-solid  fa-file-alt",
      label: t("sidebar.menu.document_creation"),
      to: "/dashboard/FilledTemplet",
    },
    user?.role === "admin" && {
      icon: "fa-solid fa-user",
      label: t("sidebar.menu.user_management"),
      to: "/dashboard/users",
    },
    {
      icon: "fa-solid fa-magnifying-glass",
      label: t("sidebar.menu.content_tracker"),
      to: "/dashboard/content-tracker",
    },
    {
      icon: "fa-solid fa-ban",
      label: t("sidebar.menu.excluded_domains"),
      to: "/dashboard/excluded-domains",
    },
  ].filter(Boolean);

  const handleLogout = () => {
    logout(); //
    navigate("/login");
  };

  return (
    <div
      className={`offcanvas offcanvas-end d-lg-flex bg-white sidebar-custom`}
      tabIndex="-1"
      id="offcanvasNavbar"
      aria-labelledby="offcanvasNavbarLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title fw-bold fs-4" id="offcanvasNavbarLabel">
          {t("sidebar.title")}
        </h5>
        <button
          type="button"
          className="btn-close d-block d-lg-none me-auto ms-0"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body d-flex flex-column justify-content-between">
        <ul className="navbar-nav justify-content-end pe-3">
          {menuItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link
                to={item.to}
                className={`d-flex fs-5 rounded-2 mb-2 align-items-center px-4 py-2 text-decoration-none ${
                  currentPath === item.to
                    ? "primary-bg text-white"
                    : "text-secondary hover-success"
                }`}
              >
                <i className={item.icon}></i>
                <span className="me-2 small fw-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-danger w-100 d-flex justify-content-center align-items-center"
            onClick={handleLogout}
          >
            {t("sidebar.logout")}
            <i className="fa-solid fa-right-from-bracket fs-4"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
