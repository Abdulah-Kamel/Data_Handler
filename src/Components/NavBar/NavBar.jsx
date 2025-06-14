import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";

const NavBar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);

  return (
    <header>
      <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary border-bottom shadow">
        <div className="container">
          <a className="navbar-brand fw-bold fs-2" href="#">
            Data Handler
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse py-3 py-md-0"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mx-auto pe-0 mb-2 mb-lg-0 align-items-center gap-3 py-2">
              <li className="nav-item nav-bg">
                <a href="/" className="nav-link text-dark fs-4 fw-bold">
                  {t("navbar.home")}
                </a>
              </li>
              <li className="nav-item nav-bg">
                <a href="#" className="nav-link text-dark fs-4 fw-bold">
                  {t("navbar.services")}
                </a>
              </li>
              <li className="nav-item nav-bg">
                <a href="#" className="nav-link text-dark fs-4 fw-bold">
                  {t("navbar.about")}
                </a>
              </li>
              <li className="nav-item nav-bg">
                <a href="#" className="nav-link text-dark fs-4 fw-bold">
                  {t("navbar.contact")}
                </a>
              </li>
            </ul>
            <div className="d-flex align-items-center gap-3">
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
                <ul
                  className="dropdown-menu"
                  aria-labelledby="languageDropdown"
                >
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
              <a
                className="btn btn-outline-success px-4 fs-5 navBar-btn"
                type="submit"
                href="/login"
              >
                {t("navbar.start_now")}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
