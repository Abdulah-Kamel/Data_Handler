import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ForgetPassword from "./Components/Auth/ForgetPassword";
import Login from "./Components/Auth/Login";
import ResetCode from "./Components/Auth/ResetCode";
import ResetPassword from "./Components/Auth/ResetPassword";
import Home from "./Components/Home/Home";
import Categories from "./Components/main/categories/Categories";
import Layout from "./Components/main/Layout/Layout";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import Templates from "./Components/main/templates/Templates";
import BulkData from "./Components/main/bulkData/BulkData";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-code" element={<ResetCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Categories />} />
          <Route path="/dashboard/bulk-data" element={<BulkData />} />
          <Route path="/dashboard/templates/:categoryId" element={<Templates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
