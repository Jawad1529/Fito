import { ConfigProvider } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, RequireSuperAdmin } from './components/templates/ProtectedRoute';
import AdminLayout from './components/templates/AdminLayout';

import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import UserManagementPage from './pages/Users/UserManagementPage';
import ConsultationManagementPage from './pages/Consultations/ConsultationManagementPage';
import ConsultationDetailPage from './pages/Consultations/ConsultationDetailPage';
import ProductManagementPage from './pages/Products/ProductManagementPage';
import BlogManagementPage from './pages/Blogs/BlogManagementPage';
import ReviewManagementPage from './pages/Reviews/ReviewManagementPage';
import SettingsPage from './pages/Settings/SettingsPage';
import UnauthorizedPage from './pages/Unauthorized/UnauthorizedPage';
import { ROUTES } from './constants/routes';

const theme = {
  token: {
    colorPrimary: '#CF4842',
    colorPrimaryHover: '#A34840',
    colorPrimaryActive: '#8A3B35',
    borderRadius: 8,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
};

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />

            <Route element={<RequireAuth />}>
              <Route element={<AdminLayout />}>
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.CONSULTATIONS} element={<ConsultationManagementPage />} />
                <Route path={ROUTES.CONSULTATION_DETAIL} element={<ConsultationDetailPage />} />
                <Route path={ROUTES.PRODUCTS} element={<ProductManagementPage />} />
                <Route path={ROUTES.BLOGS} element={<BlogManagementPage />} />
                <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

                <Route element={<RequireSuperAdmin />}>
                  <Route path={ROUTES.USERS} element={<UserManagementPage />} />
                  <Route path={ROUTES.REVIEWS} element={<ReviewManagementPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}
