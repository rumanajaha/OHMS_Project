import React from 'react';
import {
  Bell, Search, User as UserIcon,
  LogOut, ChevronDown, Check, Clock, User, Lock, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';
import { changePasswordApi } from '../api/user';
import { searchEmployeesApi } from '../api/employee';

export const TopNavbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [passwordData, setPasswordData] = React.useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = React.useState('');
  const [passwordSuccess, setPasswordSuccess] = React.useState('');
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);

  const [globalSearchTerm, setGlobalSearchTerm] = React.useState('');
  const [globalSearchResults, setGlobalSearchResults] = React.useState([]);
  const [isGlobalSearching, setIsGlobalSearching] = React.useState(false);
  const [showGlobalDropdown, setShowGlobalDropdown] = React.useState(false);
  const searchRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowGlobalDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const fetchSearchResults = async () => {
      if (!globalSearchTerm.trim()) {
        setGlobalSearchResults([]);
        return;
      }
      setIsGlobalSearching(true);
      try {
        const results = await searchEmployeesApi({ name: globalSearchTerm });
        setGlobalSearchResults(results || []);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsGlobalSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [globalSearchTerm]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePasswordApi({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 1500);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
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
          ref={searchRef}
          style={{ position: 'relative' }}
        >
          <div
            className="search-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-main)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              width: '280px',
              border: '1px solid transparent',
              transition: 'border-color var(--transition-fast)'
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search employees or skills..."
              value={globalSearchTerm}
              onChange={(e) => {
                setGlobalSearchTerm(e.target.value);
                setShowGlobalDropdown(true);
              }}
              onFocus={() => setShowGlobalDropdown(true)}
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

          {showGlobalDropdown && globalSearchTerm.trim() && (
            <div
              className="dropdown-menu animate-fade-in"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              {isGlobalSearching ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Searching...
                </div>
              ) : globalSearchResults.length > 0 ? (
                <div style={{ padding: '0.5rem 0' }}>
                  {globalSearchResults.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => {
                        navigate(`/admin/employees/view/${emp.id}`);
                        setShowGlobalDropdown(false);
                        setGlobalSearchTerm('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-subtle)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {emp.email}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No employees found.
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => navigate(`/${user?.role.toLowerCase()}/notifications`)}
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
            {unreadCount > 0 && (
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
            )}
          </button>
        </div>

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
                {user?.fullName}
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

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowProfileDropdown(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  <Lock size={16} /> Change Password
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

    {/* Change Password Modal */}
    {showPasswordModal && (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setShowPasswordModal(false); }}
      >
        <div
          className="card animate-fade-in"
          style={{
            width: '440px',
            maxWidth: '90vw',
            padding: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="h3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} className="text-primary" /> Change Password
            </h3>
            <button
              onClick={() => setShowPasswordModal(false)}
              style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              &times;
            </button>
          </div>

          {passwordError && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid #fecaca' }}>
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showOld ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter current password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isChangingPassword}>
                {isChangingPassword ? 'Changing...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};