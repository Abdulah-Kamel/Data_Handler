import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ForgetPassword from "./Componenets/Auth/ForgetPassword.jsx";
import ResetCode from "./Componenets/Auth/ResetCode.jsx";
import ResetPassword from "./Componenets/Auth/ResetPassword.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { HelmetProvider } from 'react-helmet-async';

import "./index.css";
import Login from "./Componenets/Auth/Login.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-code" element={<ResetCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
