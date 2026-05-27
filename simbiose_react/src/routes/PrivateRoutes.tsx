import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { DashboardPage } from "../pages/dashboard/DashboardPage";

export function PrivateRoutes() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
}