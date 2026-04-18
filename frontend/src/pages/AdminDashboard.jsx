import React from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { usePositions } from '../context/PositionContext';
import { useTasks } from '../context/TaskContext';
import { useNotifications } from '../context/NotificationContext';
import { Users, Building, Activity, CheckSquare, Network } from 'lucide-react';
import { getDirectReports, isManagerialPosition } from '../utils/org';
import { OrgHierarchyPreview } from '../components/OrgHierarchyPreview';

export const AdminDashboard = () => {
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const { positions } = usePositions();
  const { tasks } = useTasks();
  const { notifications, unreadCount } = useNotifications();

  const managersCount = employees.filter((employee) => {
    const position = positions.find((entry) => String(entry.id) === String(employee.positionId));
    return isManagerialPosition(position?.title) || getDirectReports(employee, employees, positions).length > 0;
  }).length;

  const activeTasksCount = tasks.filter((task) => task.status !== 'Completed').length;
  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="h1">Overview</h1>
        <p className="text-muted text-sm">Welcome back to the administrative portal.</p>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Employees</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>{employees.length}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Departments</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={18} />
            </div>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>{departments.length}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Managers</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} />
            </div>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>{managersCount}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Active Tasks</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={18} />
            </div>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>{activeTasksCount}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="h3">Organization Preview</h2>
            <a href="/admin/hierarchy" className="text-sm" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Open Full Map &rarr;
            </a>
          </div>
          <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <OrgHierarchyPreview />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h2 className="h3" style={{ marginBottom: '1.5rem' }}>Notifications</h2>
            <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
              {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentNotifications.length === 0 ? (
                <p className="text-sm text-muted">No recent notifications.</p>
              ) : (
                recentNotifications.map((notification) => (
                  <div key={notification.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: notification.isRead ? 'var(--border-color)' : 'var(--primary)', marginTop: '6px' }} />
                    <div>
                      <p className="text-sm" style={{ fontWeight: 500, color: 'var(--text-main)' }}>{notification.title}</p>
                      <p className="text-xs text-muted">{notification.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <h2 className="h3" style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '1rem', marginLeft: '0.25rem' }}>
                <p className="text-sm" style={{ color: 'var(--text-main)' }}>
                  {positions.length} positions currently shape the reporting tree.
                </p>
                <p className="text-xs text-muted">Position-based hierarchy enabled</p>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '1rem', marginLeft: '0.25rem' }}>
                <p className="text-sm" style={{ color: 'var(--text-main)' }}>
                  Departments remain flat in the current UI while parent-department support stays available in the backend.
                </p>
                <p className="text-xs text-muted">Department hierarchy hidden for now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
