import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("User"));

  useEffect(() => {
    const isTokenExpired = (token) => {
      try {
        const { exp } = jwtDecode(token);
        return Date.now() >= exp * 1000;
      } catch (e) {
        return true;
      }
    };

    const validateToken = async () => {
      if (!user || !user.access) {
        sessionStorage.removeItem("User");
        navigate("/login", { replace: true });
        return;
      }

      if (isTokenExpired(user.access)) {
        // Access expired, try to refresh
        if (user.refresh) {
          try {
            const { access } = await authService.refresh(user.refresh);
            sessionStorage.setItem("User", JSON.stringify({ ...user, access }));
          } catch (error) {
            const errorDetail = error?.response?.data?.detail;
            const errorCode = error?.response?.data?.code;
            if (
              errorDetail === "Token is blacklisted" &&
              errorCode === "token_not_valid"
            ) {
              sessionStorage.removeItem("User");
              navigate("/login", { replace: true });
            }
          }
        } else {
          sessionStorage.removeItem("User");
          navigate("/login", { replace: true });
        }
      }

      setValidated(true);
    };

    validateToken();
  }, []);

  if (!user || !validated) {
    return null; // Or loading spinner if desired
  }

  return children;
};

export default ProtectedRoute;
