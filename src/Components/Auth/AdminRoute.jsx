import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem("User"));
  const userRole = user.role;
  if (userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children; 
};

export default AdminRoute;
