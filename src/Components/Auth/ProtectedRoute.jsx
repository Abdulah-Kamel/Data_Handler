// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, accessToken, logout } = useAuth();

  if (user === null || accessToken === null || user === undefined) {
    logout();
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
