// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { PulseLoader } from "react-spinners";

const ProtectedRoute = ({ children }) => {
  const { user, accessToken } = useAuth();
  
  if (user === undefined) {
    return (  <div className="position-absolute bg-main-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100 vh-100">
      <PulseLoader color="#0aad0a" size={30} />
    </div>);
  }
  if (!user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
