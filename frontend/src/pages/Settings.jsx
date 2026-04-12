import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useThemeLang, t_dict } from '../context/ThemeLangContext';

export const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme, language, setLanguage } = useThemeLang();

  const dict = t_dict[language] || t_dict['English'];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="h1">{dict.accountSettings}</h1>
        <p className="text-muted text-sm">Manage {user?.name}'s account preferences and settings.</p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 className="h3" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            {dict.preferences}
          </h3>
          <div className="form-group">
            <label className="form-label">System Mode</label>
            <select className="form-input" style={{ maxWidth: '300px' }} value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="light">Stormy Morning (Light)</option>
              <option value="dark">Dark Mode</option>
              <option value="system">System Default</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Language</label>
            <select className="form-input" style={{ maxWidth: '300px' }} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="English">English (US)</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="French">Français (French)</option>
              <option value="German">Deutsch (German)</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="h3" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Notifications
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <input type="checkbox" id="email_notif" defaultChecked />
            <label htmlFor="email_notif" style={{ fontSize: '0.875rem' }}>Receive email notifications for Tasks</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input type="checkbox" id="sys_notif" defaultChecked />
            <label htmlFor="sys_notif" style={{ fontSize: '0.875rem' }}>Receive system alerts for company updates</label>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => alert('Settings saved successfully!')}>{dict.save}</button>
          <button className="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};