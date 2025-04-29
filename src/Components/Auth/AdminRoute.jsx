import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem("User"));
  const userRole = user.role;
  console.log(userRole);

  if (userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children; // Render the child components inside the AdminRout
};

export default AdminRoute;
