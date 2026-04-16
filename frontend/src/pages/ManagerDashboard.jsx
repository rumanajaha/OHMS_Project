import React, { useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { usePositions } from '../context/PositionContext';
import { useTasks } from '../context/TaskContext';
import { useNotifications } from '../context/NotificationContext';
import { Users, CheckSquare, Bell, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEmployeeFullName, getPositionTitleById } from '../utils/org';

export const ManagerDashboard = () => {
  const { employees } = useEmployees();
  const { user } = useAuth();
  const { positions } = usePositions();
  const { tasks } = useTasks();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const myTeam = employees.filter(
    (e) => e.managerId === user?.employeeId
  );
  const filteredTeam = myTeam.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const unreadNotes = notifications.filter((n) => !n.isRead);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="h1">Manager Overview</h1>
          <p className="text-muted text-sm">Monitor your team's assignments and performance.</p>
        </div>

        <div
          className="search-bar"
          style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', width: '300px' }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '0.75rem', width: '100%', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/manager/team')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} />
            </div>
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Team Size</span>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>{myTeam.length}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/manager/tasks')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--warning)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={16} />
            </div>
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Tasks Pending</span>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>{pendingTasks.length}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/manager/notifications')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={16} />
            </div>
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Unread Notifications</span>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>{unreadNotes.length}</div>
        </div>
      </div>

      {/* <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <UserCheck size={16} className="text-success" />
            <span className="text-sm font-medium">Regular (Present)</span>
          </div>
          <div className="h2">{regularCount}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Activity size={16} className="text-warning" />
            <span className="text-sm font-medium">Irregular (Late/Half)</span>
          </div>
          <div className="h2">{irregularCount}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <UserX size={16} className="text-danger" />
            <span className="text-sm font-medium">On Leave</span>
          </div>
          <div className="h2">{leaveCount}</div>
        </div>
      </div> */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="h3">Team Preview</h2>
            <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem' }} onClick={() => navigate('/manager/team')}>View All</button>
          </div>
          <div style={{ padding: '1rem 1.5rem', maxHeight: '350px', overflowY: 'auto' }}>
            {filteredTeam.length === 0 ? (
              <p className="text-muted text-sm text-center py-4">No team members match your search.</p>
            ) : (
              filteredTeam.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                      {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{getEmployeeFullName(member)}</p>
                      <p className="text-xs text-muted">{getPositionTitleById(positions, member.positionId)}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted" />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="h3">Tasks Overview</h2>
          </div>
          <div style={{ padding: '1.5rem', maxHeight: '350px', overflowY: 'auto' }}>
            {pendingTasks.length === 0 && <p className="text-muted text-sm text-center">No pending tasks!</p>}
            {pendingTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', borderLeft: `3px solid ${task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'}`, cursor: 'pointer' }}
                onClick={() => navigate(`/manager/tasks/${task.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>{task.title}</p>
                  <span className="badge text-xs" style={{ background: 'var(--bg-surface)' }}>{task.progress}%</span>
                </div>
                <p className="text-xs text-muted mb-2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-xs font-medium text-primary">{task.assignee}</span>
                  <span className="text-xs text-muted">Due: {task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
