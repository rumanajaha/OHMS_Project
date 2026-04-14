import React from 'react';
import {
  Bell, Search, User as UserIcon,
  LogOut, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';

export const TopNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="layout-navbar">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Breadcrumb />
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div
          className="search-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-main)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            width: '240px',
            border: '1px solid transparent',
            transition: 'border-color var(--transition-fast)'
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              marginLeft: '0.5rem',
              width: '100%',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif'
            }}
          />
        </div>

        <button
          style={{
            background: 'var(--bg-main)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            position: 'relative'
          }}
        >
          <Bell size={18} color="var(--text-muted)" />
          <span
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'var(--accent)',
              width: 8,
              height: 8,
              borderRadius: '50%',
              border: '2px solid var(--bg-surface)'
            }}
          />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <div
              className="hide-on-mobile"
              style={{
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <span style={{
                fontSize: '0.8125rem',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                color: 'var(--text-main)',
                lineHeight: 1.2
              }}>
                {user?.name}
              </span>

              <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                {user?.role}
              </span>
            </div>

            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}>
              {user?.name?.charAt(0)}
            </div>

            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showProfileDropdown && (
            <div
              className="dropdown-menu"
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '0.75rem',
                width: '220px',
                zIndex: 100
              }}
            >
              <div style={{ padding: '0.5rem' }}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate(`/${user?.role.toLowerCase()}/profile`);
                    setShowProfileDropdown(false);
                  }}
                >
                  <UserIcon size={16} /> My Profile
                </button>

                <div style={{
                  margin: '0.5rem -0.5rem',
                  borderTop: '1px solid var(--border-color)'
                }} />

                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};