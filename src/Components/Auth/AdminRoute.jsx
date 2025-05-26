// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  console.log(user);
  

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // Logged in, but not admin
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
