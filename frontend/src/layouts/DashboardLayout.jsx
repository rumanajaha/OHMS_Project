import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopNavbar } from '../components/TopNavbar';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', color: 'var(--primary)' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="app-container animate-fade-in">
      <Sidebar />
      <div className="main-content-wrapper">
        <TopNavbar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};