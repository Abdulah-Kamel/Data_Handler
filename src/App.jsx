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
import FilledTemplet from "./Components/main/FilledTemplet/FilledTemplet";
import AdminRoute from "./Components/Auth/AdminRoute";
import Users from "./Components/main/Users/Users";
import { AuthProvider } from "./Context/AuthContext";
import ContentTracker from "./Components/main/ContentTracker/ContentTracker";
import ResultsView from "./Components/main/ContentTracker/ResultsView";
import ExternalTasksPage from "./Components/main/ContentTracker/ExternalTasksPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-code" element={<ResetCode />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
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
            <Route
              path="/dashboard/FilledTemplet"
              element={<FilledTemplet />}
            />
            <Route
              path="/dashboard/templates/:categoryId"
              element={<Templates />}
            />
            <Route
              path="/dashboard/users"
              element={
                <AdminRoute>
                  <Users />
                </AdminRoute>
              }
            />
            <Route path="/dashboard/content-tracker" element={<ContentTracker />} />
            <Route path="/dashboard/content-tracker/running" element={<ExternalTasksPage />} />
            <Route path="/dashboard/content-tracker/results/:taskId" element={<ResultsView />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
