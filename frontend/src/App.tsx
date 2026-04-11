import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { DepartmentProvider } from './context/DepartmentContext';
import { TaskProvider } from './context/TaskContext';
import { DocumentProvider } from './context/DocumentContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmployeeList } from './pages/EmployeeList';
import { EmployeeForm } from './pages/EmployeeForm';
import { EmployeeDetail } from './pages/EmployeeDetail';

import { ManagerDashboard } from './pages/ManagerDashboard';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { DepartmentList } from './pages/DepartmentList';
import { DepartmentForm } from './pages/DepartmentForm';
import { OrgHierarchy } from './pages/OrgHierarchy';
import { TaskManagement } from './pages/TaskManagement';
import { MyTeam } from './pages/MyTeam';
import { Documents } from './pages/Documents';
import { Notifications } from './pages/Notifications';
import { NotificationDetail } from './pages/NotificationDetail';
import { MyProfile } from './pages/MyProfile';
import { Settings } from './pages/Settings';
import { TaskDetail } from './pages/TaskDetail';

import { ThemeLangProvider } from './context/ThemeLangContext';

const App: React.FC = () => {
  return (
    <ThemeLangProvider>
      <AuthProvider>
        <DepartmentProvider>
          <EmployeeProvider>
            <TaskProvider>
              <DocumentProvider>
                <NotificationProvider>
                  <BrowserRouter>
                    <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes inside Layout */}
                <Route element={<DashboardLayout />}>
                  {/* Default redirect (you might want a more intelligent redirect based on role) */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/hierarchy" element={<OrgHierarchy />} />
                  <Route path="/admin/employees" element={<EmployeeList />} />
                  <Route path="/admin/employees/new" element={<EmployeeForm />} />
                  <Route path="/admin/employees/edit/:id" element={<EmployeeForm />} />
                  <Route path="/admin/employees/view/:id" element={<EmployeeDetail />} />
                  <Route path="/admin/departments" element={<DepartmentList />} />
                  <Route path="/admin/departments/new" element={<DepartmentForm />} />
                  <Route path="/admin/departments/edit/:id" element={<DepartmentForm />} />
                  <Route path="/admin/tasks" element={<TaskManagement />} />
                  <Route path="/admin/tasks/:id" element={<TaskDetail />} />
                  <Route path="/admin/documents" element={<Documents />} />
                  <Route path="/admin/notifications" element={<Notifications />} />
                  <Route path="/admin/notifications/:id" element={<NotificationDetail />} />
                  <Route path="/admin/settings" element={<Settings />} />
                  <Route path="/admin/profile" element={<Settings />} />
                  
                  {/* Manager Routes */}
                  <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                  <Route path="/manager/team" element={<MyTeam />} />
                  <Route path="/manager/tasks" element={<TaskManagement />} />
                  <Route path="/manager/tasks/:id" element={<TaskDetail />} />
                  <Route path="/manager/documents" element={<Documents />} />
                  <Route path="/manager/notifications" element={<Notifications />} />
                  <Route path="/manager/notifications/:id" element={<NotificationDetail />} />
                  <Route path="/manager/settings" element={<Settings />} />
                  <Route path="/manager/profile" element={<Settings />} />
                  
                  {/* Employee Routes */}
                  <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                  <Route path="/employee/profile" element={<MyProfile />} />
                  <Route path="/employee/tasks" element={<TaskManagement />} />
                  <Route path="/employee/tasks/:id" element={<TaskDetail />} />
                  <Route path="/employee/documents" element={<Documents />} />
                  <Route path="/employee/notifications" element={<Notifications />} />
                  <Route path="/employee/notifications/:id" element={<NotificationDetail />} />
                  <Route path="/employee/settings" element={<Settings />} />
                </Route>
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                  </BrowserRouter>
                </NotificationProvider>
              </DocumentProvider>
            </TaskProvider>
          </EmployeeProvider>
        </DepartmentProvider>
      </AuthProvider>
    </ThemeLangProvider>
  );
};

export default App;
