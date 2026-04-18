import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, LogOut, Menu, X, CheckSquare,
  Settings, Network, Grid, FileText, Bell, Briefcase
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/admin/hierarchy', icon: <Network size={18} />, label: 'Hierarchy Map' },
    { to: '/admin/employees', icon: <Users size={18} />, label: 'Employees' },
    { to: '/admin/departments', icon: <Grid size={18} />, label: 'Departments' },
    { to: '/admin/positions', icon: <Briefcase size={18} />, label: 'Positions' },
    { to: '/admin/tasks', icon: <CheckSquare size={18} />, label: 'Tasks' },
    { to: '/admin/documents', icon: <FileText size={18} />, label: 'Documents' },
  ];

  const managerLinks = [
    { to: '/manager/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/manager/team', icon: <Users size={18} />, label: 'My Team' },
    { to: '/manager/tasks', icon: <CheckSquare size={18} />, label: 'Tasks' },
    { to: '/manager/documents', icon: <FileText size={18} />, label: 'Documents' },
  ];

  const employeeLinks = [
    { to: '/employee/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/employee/team', icon: <Users size={18} />, label: 'My Team' },
    { to: '/employee/tasks', icon: <CheckSquare size={18} />, label: 'Tasks' },
    { to: '/employee/documents', icon: <FileText size={18} />, label: 'Documents' },
  ];

  let links = employeeLinks;
  if (user.role === 'ADMIN') links = adminLinks;
  if (user.role === 'MANAGER') links = managerLinks;

  return (
    <>
      <button
        className="mobile-sidebar-toggle btn btn-ghost"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 50,
          display: 'none'
        }}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <aside className={`layout-sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{
          padding: '2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'var(--primary)',
            borderRadius: '10px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Network size={20} />
          </div>

          <span style={{
            fontSize: '1.125rem',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            color: 'var(--primary)'
          }}>
            OrgSys
          </span>
        </div>

        <nav style={{
          padding: '0 1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          marginTop: '1rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            color: 'var(--text-light)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            padding: '0 0.5rem',
            marginBottom: '0.5rem'
          }}>
            Main Menu
          </div>

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1.5rem 1rem' }}>
          <NavLink
            to={`/${user.role.toLowerCase()}/settings`}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">
              <Settings size={18} />
            </span>
            <span>Settings</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <span className="sidebar-link-icon">
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(31, 41, 51, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 30
          }}
        />
      )}
    </>
  );
};
