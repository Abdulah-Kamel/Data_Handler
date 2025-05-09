// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, accessToken } = useAuth();
  console.log(user, accessToken);
  
  if (user === undefined) {
    return "Loading...";
  }
  if (!user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
