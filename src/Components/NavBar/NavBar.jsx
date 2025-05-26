import React from "react";

const NavBar = () => {
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
                  الرئيسية
                </a>
              </li>
              <li className="nav-item nav-bg">
                <a href="#" className="nav-link text-dark fs-4 fw-bold">
                  الخدمات
                </a>
              </li>
              <li className="nav-item nav-bg">
                <a href="#" className="nav-link text-dark fs-4 fw-bold">
                  من نحن
                </a>
              </li>
              <li className="nav-item nav-bg">
                <a href="#" className="nav-link text-dark fs-4 fw-bold">
                  اتصل بنا
                </a>
              </li>
            </ul>
            <a
              className="btn btn-outline-success px-4 fs-5 navBar-btn"
              type="submit"
              href="/login"
            >
              ابدأ الان
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
