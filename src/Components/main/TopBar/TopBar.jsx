import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

const TopBar = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const username = user.username || "user-admin";
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pathName, setPathName] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getPathName = () => {
    if (currentPath === "/dashboard") {
      setPathName(t("topbar.paths.form_creation"));
    } else if (currentPath.startsWith("/dashboard/templates/")) {
      setPathName(t("topbar.paths.templates"));
    } else if (currentPath.startsWith("/dashboard/bulk-data")) {
      setPathName(t("topbar.paths.data_management"));
    } else if (currentPath.startsWith("/dashboard/FilledTemplet")) {
      setPathName(t("topbar.paths.document_creation"));
    } else if (currentPath.startsWith("/dashboard/users")) {
      setPathName(t("topbar.paths.user_management"));
    } else if (currentPath.startsWith("/dashboard/content-tracker")) {
      setPathName(t("topbar.paths.content_tracker"));
    }
  };
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
    const getScreenWidth = () => window.innerWidth;
    if (getScreenWidth() < 600) {
      setIsMobile(true);
    }
    getPathName();
    setCurrentTime(new Date());
  }, [currentPath, i18n, i18n.language]);

  const formattedDate = currentTime.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hours = currentTime.getHours();
    return hours >= 12
      ? t("topbar.greeting.evening")
      : t("topbar.greeting.morning");
  };

  return (
    <>
      <div className="top-bar py-3 px-4 d-flex justify-content-between align-items-center ">
        <div className="user-info d-flex align-items-center">
          <div className="d-flex align-items-center">
            <button
              className={`navbar-toggler d-lg-none btn btn-outline-success border border-3 border-success ${
                isMobile ? "pt-3" : ""
              } p-2 ms-2 rounded-2`}
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
            >
              <i className="fa-solid fa-bars fa-xl"></i>
            </button>
            <div
              className="user-avatar primary-bg rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "35px", height: "35px", position: "relative" }}
            >
              <i className="fas fa-user text-white"></i>
              <span
                className="position-absolute bg-success rounded-circle"
                style={{
                  width: "10px",
                  height: "10px",
                  bottom: "0",
                  right: "0",
                  border: "2px solid white",
                }}
              ></span>
            </div>
            <span className={`main-color me-2 `}>
              {getGreeting()}, {username}
            </span>
          </div>
        </div>
        <div className="dropdown">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="languageDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {t("navbar.language")}
          </button>
          <ul className="dropdown-menu" aria-labelledby="languageDropdown">
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => changeLanguage("en")}
              >
                English
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => changeLanguage("ar")}
              >
                العربية
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="py-3 px-4 mb-4 d-flex justify-content-between align-items-center primary-bg">
        <div className={`text-white  `}>
          <i className="fa-solid fa-chevron-left"></i>
          <i className="fa-solid fa-users me-2"></i>
          <span className="me-2">{pathName}</span>
        </div>
        <div className={`text-white `}>
          <div className={`date d-flex align-items-center fw-bold`}>
            <div>
              <i className="far fa-calendar-alt ms-2"></i>
              {t("topbar.date_label")}: {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
