import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import Dashboard from '../features/dashboard/Dashboard';
import useAuthStore from '../store/authStore';
import MainLayout from '../layouts/MainLayout';
import TenantList from '../features/tenants/TenantList';
import UserList from '../features/users/UserList';
import RoleList from '../features/roles/RoleList';
import PrivilegeList from '../features/privileges/PrivilegeList';
import OrganizationList from '../features/organizations/OrganizationList';
import LegalEntityList from '../features/legal-entities/LegalEntityList';
import AuditLog from '../features/audit/AuditLog';
import BulkOps from '../features/bulk/BulkOps';
import Analytics from '../features/analytics/Analytics';
import UserProfile from '../features/users/UserProfile';
import TenantSettings from '../features/tenants/TenantSettings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/tenants"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TenantList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/users"
        element={
          <ProtectedRoute>
            <MainLayout>
              <UserList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/roles"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RoleList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/privileges"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PrivilegeList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/organizations"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OrganizationList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/legal-entities"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LegalEntityList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/audit"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AuditLog />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/bulk"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BulkOps />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/analytics"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Analytics />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <UserProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TenantSettings tenantId="1" />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;