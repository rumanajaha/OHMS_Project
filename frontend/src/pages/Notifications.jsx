import React from 'react';
import { Bell, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleBasePath } from '../utils/org';

export const Notifications = () => {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = getRoleBasePath(user?.role);

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <Clock size={20} />;
      case 'success': return <CheckCircle size={20} />;
      case 'danger': return <ShieldAlert size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const handleNotificationClick = async (id, isRead) => {
    if (!isRead) await markAsRead(id);
    navigate(`${basePath}/notifications/${id}`);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="h1">Notifications</h1>
          <p className="text-muted text-sm">Stay updated with alerts and messages.</p>
        </div>
        <button className="btn btn-ghost text-sm text-primary" onClick={markAllAsRead}>Mark all as read</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.length === 0 && <p className="text-muted text-center pt-8">No notifications</p>}
        {notifications.map((note) => (
          <div
            key={note.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              cursor: 'pointer',
              borderLeft: note.isRead ? 'none' : `3px solid var(--${note.uiType})`,
            }}
            onClick={() => handleNotificationClick(note.id, note.isRead)}
          >
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--bg-subtle)',
                  color: `var(--${note.uiType})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getIcon(note.uiType)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontWeight: note.isRead ? 500 : 700, fontSize: '0.9375rem', color: 'var(--text-main)', fontFamily: 'Poppins, sans-serif' }}>
                    {note.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {!note.isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
                    <span className="text-xs text-muted">{note.time}</span>
                  </div>
                </div>
                <p
                  className="text-sm"
                  style={{
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {note.message}
                </p>
                <p className="text-xs text-muted" style={{ marginTop: '1rem' }}>{note.typeLabel}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
