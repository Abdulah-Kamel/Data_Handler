import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const User = JSON.parse(sessionStorage.getItem("User"));
  if (!User) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
