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
        setPathName("تصنيفات القوالب");
      } else if (currentPath.startsWith("/dashboard/templates/")) {
        setPathName("القوالب");
      } else if (currentPath.startsWith("/dashboard/bulk-data")) {
        setPathName("بيانات مجمعه");
      } else if (currentPath.startsWith("/dashboard/FilledTemplet")) {
        setPathName("ملئ القوالب");
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
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, [currentPath]);

    const handleLogout = () => {
      sessionStorage.removeItem("User");
      navigate("/login");
    };

    const formattedTime = currentTime.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

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
                class={`navbar-toggler btn btn-outline-success border border-3 border-success ${isMobile ? "pt-3" : ""} p-2 ms-2 rounded-2`}
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
              <span className={`main-color me-2 ${isMobile ? "fs-6" : "fs-5"}`}>
                {getGreeting()}, {username}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-danger text-white d-flex justify-content-center align-items-center text-decoration-none border border-danger rounded logout-icon"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-right-from-bracket fs-4"></i>
            </button>
          </div>
        </div>
        <div className="py-3 px-4 mb-4 d-flex justify-content-between align-items-center primary-bg">
          <div className={`text-white  ${isMobile ? "fs-6" : "fs-5"}`}>
            <i className="fa-solid fa-chevron-left"></i>
            <i className="fa-solid fa-users me-2"></i>
            <span className="me-2">{pathName}</span>
          </div>
          <div className={`text-white ${isMobile ? "" : ""}`}
          >
            <div
              className={`date d-flex align-items-center ${
                isMobile ? "small-text flex-column" : "fs-5"
              } fw-bold`}
            >
              <div>
                <i className="far fa-calendar-alt ms-2"></i>
                التاريخ :{formattedDate}
              </div>
              <div className="me-3">
                <i className="far fa-clock ms-2"></i>
                الوقت :{formattedTime}
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default TopBar;
