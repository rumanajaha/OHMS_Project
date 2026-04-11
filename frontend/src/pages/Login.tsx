import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';
import { Network } from 'lucide-react';

export const Login: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Employee');
  
  const [error, setError] = useState('');

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = (location.state as any)?.from?.pathname;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !name) {
      setError('Name is required for Sign Up');
      return;
    }
    
    if (!email || !password) {
      setError('Email and Password are required');
      return;
    }

    try {
      // In a real app, signin vs signup are separate. 
      // For this mock, login automatically creates the user if they don't exist in the context mock.
      // We pass the role selected, or fallback to inferring it from email for generic sign ins.
      const inferredRole = mode === 'signup' ? role : 
                           (email.includes('admin') ? 'Admin' : email.includes('manager') ? 'Manager' : 'Employee');
      
      await login(email, inferredRole);
      navigate(`/${inferredRole.toLowerCase()}/dashboard`, { replace: true });
    } catch {
      setError('Failed to authenticate. Please check your credentials.');
    }
  };

  const handleDemoFill = (demoRole: Role) => {
    setMode('signin');
    setEmail(`${demoRole.toLowerCase()}@demo.com`);
    setPassword('password123');
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      background: 'linear-gradient(135deg, var(--bg-main) 0%, #cbd5e1 100%)' 
    }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: 'white', borderRadius: '16px', color: 'var(--primary)', boxShadow: 'var(--shadow-md)', marginBottom: '1.5rem' }}>
            <Network size={28} />
          </div>
          <h1 className="h2" style={{ color: 'var(--primary)', fontWeight: 600 }}>Organizational Hierarchy System</h1>
          <p className="text-muted text-sm" style={{ marginTop: '0.5rem' }}>Access your enterprise portal</p>
        </div>

        <div className="card" style={{ padding: '0', borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-subtle)' }}>
            <button 
              type="button"
              onClick={() => { setMode('signin'); setError(''); }} 
              style={{ flex: 1, padding: '1rem', background: mode === 'signin' ? 'white' : 'transparent', border: 'none', fontWeight: mode === 'signin' ? 600 : 500, color: mode === 'signin' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', borderBottom: mode === 'signin' ? '2px solid var(--primary)' : '2px solid transparent' }}>
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setMode('signup'); setError(''); }} 
              style={{ flex: 1, padding: '1rem', background: mode === 'signup' ? 'white' : 'transparent', border: 'none', fontWeight: mode === 'signup' ? 600 : 500, color: mode === 'signup' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', borderBottom: mode === 'signup' ? '2px solid var(--primary)' : '2px solid transparent', borderLeft: '1px solid var(--border-color)' }}>
              Sign Up
            </button>
          </div>

          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h3 className="h3">{mode === 'signin' ? 'Welcome Back' : 'Create an Account'}</h3>
              <p className="text-xs text-muted">
                {mode === 'signin' ? 'Enter your saved credentials to continue.' : 'Register a new user to the organization.'}
              </p>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {mode === 'signup' && (
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ color: 'var(--text-muted)' }}>Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: mode === 'signup' ? '1.25rem' : '2rem' }}>
                <label className="form-label" style={{ color: 'var(--text-muted)' }}>Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {mode === 'signup' && (
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Requested Role</label>
                  <select className="form-input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                    <option value="Employee">Employee (Standard Access)</option>
                    <option value="Manager">Manager (Team Access)</option>
                    <option value="Admin">Admin (Full Access)</option>
                  </select>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                {mode === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
              
              {/* Optional Demo Helpers only visible in Sign In mode to speed up testing */}
              {mode === 'signin' && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                   <p className="text-xs text-muted" style={{ marginBottom: '0.75rem' }}>Testing? Use saved demo credentials:</p>
                   <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button type="button" className="badge badge-primary" style={{ border: 'none', cursor: 'pointer', padding: '0.4rem 0.75rem' }} onClick={() => handleDemoFill('Admin')}>Admin</button>
                      <button type="button" className="badge badge-warning" style={{ border: 'none', cursor: 'pointer', padding: '0.4rem 0.75rem' }} onClick={() => handleDemoFill('Manager')}>Manager</button>
                      <button type="button" className="badge badge-success" style={{ border: 'none', cursor: 'pointer', padding: '0.4rem 0.75rem' }} onClick={() => handleDemoFill('Employee')}>Employee</button>
                   </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
