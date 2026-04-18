import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { DepartmentProvider } from './context/DepartmentContext';
import { PositionProvider } from './context/PositionContext';
import { TaskProvider } from './context/TaskContext';
import { DocumentProvider } from './context/DocumentContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeLangProvider } from './context/ThemeLangContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { RoleRoute } from './components/RoleRoute';
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
import { PositionList } from './pages/PositionList';
import { PositionForm } from './pages/PositionForm';

const App = () => {
  return (
    <ThemeLangProvider>
      <AuthProvider>
        <DepartmentProvider>
          <PositionProvider>
            <EmployeeProvider>
              <TaskProvider>
                <DocumentProvider>
                  <NotificationProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route element={<DashboardLayout />}>
                          <Route path="/" element={<Navigate to="/login" replace />} />

                          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/hierarchy" element={<OrgHierarchy />} />
                            <Route path="/admin/employees" element={<EmployeeList />} />
                            <Route path="/admin/employees/new" element={<EmployeeForm />} />
                            <Route path="/admin/employees/edit/:id" element={<EmployeeForm />} />
                            <Route path="/admin/employees/view/:id" element={<EmployeeDetail />} />
                            <Route path="/admin/departments" element={<DepartmentList />} />
                            <Route path="/admin/departments/new" element={<DepartmentForm />} />
                            <Route path="/admin/departments/edit/:id" element={<DepartmentForm />} />
                            <Route path="/admin/positions" element={<PositionList />} />
                            <Route path="/admin/positions/new" element={<PositionForm />} />
                            <Route path="/admin/positions/edit/:id" element={<PositionForm />} />
                            <Route path="/admin/tasks" element={<TaskManagement />} />
                            <Route path="/admin/tasks/:id" element={<TaskDetail />} />
                            <Route path="/admin/documents" element={<Documents />} />
                            <Route path="/admin/notifications" element={<Notifications />} />
                            <Route path="/admin/notifications/:id" element={<NotificationDetail />} />
                            <Route path="/admin/settings" element={<Settings />} />
                            <Route path="/admin/profile" element={<MyProfile />} />
                          </Route>

                          <Route element={<RoleRoute allowedRoles={['MANAGER']} />}>
                            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                            <Route path="/manager/team" element={<MyTeam />} />
                            <Route path="/manager/tasks" element={<TaskManagement />} />
                            <Route path="/manager/tasks/:id" element={<TaskDetail />} />
                            <Route path="/manager/documents" element={<Documents />} />
                            <Route path="/manager/notifications" element={<Notifications />} />
                            <Route path="/manager/notifications/:id" element={<NotificationDetail />} />
                            <Route path="/manager/settings" element={<Settings />} />
                            <Route path="/manager/profile" element={<MyProfile />} />
                          </Route>

                          <Route element={<RoleRoute allowedRoles={['EMPLOYEE']} />}>
                            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                            <Route path="/employee/team" element={<MyTeam />} />
                            <Route path="/employee/profile" element={<MyProfile />} />
                            <Route path="/employee/tasks" element={<TaskManagement />} />
                            <Route path="/employee/tasks/:id" element={<TaskDetail />} />
                            <Route path="/employee/documents" element={<Documents />} />
                            <Route path="/employee/notifications" element={<Notifications />} />
                            <Route path="/employee/notifications/:id" element={<NotificationDetail />} />
                            <Route path="/employee/settings" element={<Settings />} />
                          </Route>
                        </Route>

                        <Route path="*" element={<Navigate to="/login" replace />} />
                      </Routes>
                    </BrowserRouter>
                  </NotificationProvider>
                </DocumentProvider>
              </TaskProvider>
            </EmployeeProvider>
          </PositionProvider>
        </DepartmentProvider>
      </AuthProvider>
    </ThemeLangProvider>
  );
};

export default App;
