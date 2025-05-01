import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TopBar = () => {
  const user = JSON.parse(sessionStorage.getItem("User")) || {};
  const username = user.username || "user-admin";
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
    const [pathName, setPathName] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const getPathName = () => {
      if (currentPath === "/dashboard") {
        setPathName("انشاء النماذج");
      } else if (currentPath.startsWith("/dashboard/templates/")) {
        setPathName("القوالب");
      } else if (currentPath.startsWith("/dashboard/bulk-data")) {
        setPathName("اداره البيانات");
      } else if (currentPath.startsWith("/dashboard/FilledTemplet")) {
        setPathName("انشاء المستندات");
      } else if (currentPath.startsWith("/dashboard/users")) {
        setPathName("أداره المستخدمين");
      }
    };
    useEffect(() => {
      const getScreenWidth = () => window.innerWidth;
      if (getScreenWidth() < 600) {
        setIsMobile(true);
      }
      getPathName();
        setCurrentTime(new Date());

    }, [currentPath]);

    const formattedDate = currentTime.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const getGreeting = () => {
      const hours = currentTime.getHours();
      return hours >= 12 ? "مساء الخير" : "صباح الخير";
    };

    return (
      <>
        <div className="top-bar py-3 px-4 d-flex justify-content-between align-items-center ">
          <div className="user-info d-flex align-items-center">
            <div className="d-flex align-items-center">
              <button
                class={`navbar-toggler d-lg-none btn btn-outline-success border border-3 border-success ${
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
        </div>
        <div className="py-3 px-4 mb-4 d-flex justify-content-between align-items-center primary-bg">
          <div className={`text-white  `}>
            <i className="fa-solid fa-chevron-left"></i>
            <i className="fa-solid fa-users me-2"></i>
            <span className="me-2">{pathName}</span>
          </div>
          <div className={`text-white `}>
            <div
              className={`date d-flex align-items-center fw-bold`}
            >
              <div>
                <i className="far fa-calendar-alt ms-2"></i>
                التاريخ: {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default TopBar;
