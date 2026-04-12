import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Network, Shield, Users, User } from 'lucide-react';

const ROLE_INFO = {
  Admin: {
    icon: Shield,
    tagline: 'Full System Control',
    description: 'Manage the entire organization — employees, departments, hierarchy, and system settings.',
    color: '#1e3a5f',
    accent: '#2563eb',
  },
  Manager: {
    icon: Users,
    tagline: 'Lead Your Team',
    description: "Oversee your team's tasks, attendance, and performance with powerful team tools.",
    color: '#14532d',
    accent: '#16a34a',
  },
  Employee: {
    icon: User,
    tagline: 'Your Personal Portal',
    description: 'View your tasks, documents, notifications, and profile all in one place.',
    color: '#4a1942',
    accent: '#9333ea',
  },
};

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activePanel, setActivePanel] = useState('Employee');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: '40px', height: '40px', color: 'var(--primary)' }} />
      </div>
    );
  }

  if (isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!username || !password) {
      setError('Username and Password are required');
      setIsSubmitting(false);
      return;
    }

    try {
      await login(username, password);   
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (demoRole) => {
    setActivePanel(demoRole);
    const demoUsername = demoRole.toLowerCase();   
    setUsername(demoUsername);
    setPassword('password123');
  };

  const panelInfo = ROLE_INFO[activePanel];
  const PanelIcon = panelInfo.icon;

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
     
      <div
        style={{
          flex: 1,
          background: `linear-gradient(145deg, ${panelInfo.color} 0%, ${panelInfo.accent} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem',
          color: 'white',
          transition: 'background 0.5s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-120px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4rem', alignSelf: 'flex-start' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Network size={22} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.01em' }}>OrgHierarchy</span>
        </div>

        <div style={{ width: '96px', height: '96px', borderRadius: '28px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', backdropFilter: 'blur(8px)' }}>
          <PanelIcon size={48} color="white" />
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center', lineHeight: 1.2 }}>
          {panelInfo.tagline}
        </h2>
        <p style={{ fontSize: '1rem', opacity: 0.8, textAlign: 'center', lineHeight: 1.7, maxWidth: '360px' }}>
          {panelInfo.description}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '3rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.375rem' }}>
          {['Admin', 'Manager', 'Employee'].map((r) => (
            <button
              key={r}
              onClick={() => handleDemoFill(r)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                background: activePanel === r ? 'rgba(255,255,255,0.25)' : 'transparent',
                color: 'white',
                transition: 'background 0.2s',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

    
      <div
        style={{
          width: '480px',
          flexShrink: 0,
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
              Sign in to your enterprise portal
            </p>
          </div>

          {error && (
            <div style={{ padding: '0.875rem 1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 500, border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="admin / manager / employee" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ 
                width: '100%', 
                padding: '0.875rem', 
                fontSize: '1rem', 
                borderRadius: '8px', 
                marginTop: '0.5rem',
                opacity: isSubmitting ? 0.8 : 1 
              }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

         
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Quick demo access:</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {['Admin', 'Manager', 'Employee'].map((r) => (
                <button
                  key={r}
                  onClick={() => handleDemoFill(r)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};