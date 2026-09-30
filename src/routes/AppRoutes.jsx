import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';

import DashboardPage from '../pages/DashboardPage';
import EmployeesPage from '../pages/EmployeesPage';
import EmployeeProfilePage from '../pages/EmployeeProfilePage';
import LeavesPage from '../pages/LeavesPage';
import TeamPage from '../pages/TeamPage';
import TasksPage from '../pages/TasksPage';
import DocumentsPage from '../pages/DocumentsPage';
import EvaluationsPage from '../pages/EvaluationsPage';
import AnnouncementsPage from '../pages/AnnouncementsPage';
import NotificationsPage from '../pages/NotificationsPage';
import DocumentationPage from '../pages/DocumentationPage';
import PlanningPage from '../pages/PlanningPage';
import SettingsPage from '../pages/SettingsPage';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/:id" element={<EmployeeProfilePage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="leaves" element={<LeavesPage />} />
        <Route path="planning" element={<PlanningPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="evaluations" element={<EvaluationsPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="documentation" element={<DocumentationPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
