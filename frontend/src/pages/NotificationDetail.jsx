import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { ArrowLeft, Clock, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNotificationById } = useNotifications();

  const notification = id ? getNotificationById(id) : undefined;

  if (!notification) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 className="h2 text-muted">Notification not found</h2>
        <button className="btn btn-secondary mt-4" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <Clock size={24} />;
      case 'success': return <CheckCircle size={24} />;
      case 'danger': return <ShieldAlert size={24} />;
      default: return <Info size={24} />;
    }
  };

  const getColor = (type) => `var(--${type})`;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <button className="btn btn-ghost" style={{ padding: '0', marginBottom: '1.5rem', color: 'var(--text-muted)' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back to Notifications
      </button>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--bg-subtle)',
              color: getColor(notification.uiType),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {getIcon(notification.uiType)}
          </div>
          <div>
            <h1 className="h2" style={{ marginBottom: '0.5rem' }}>{notification.title}</h1>
            <p className="text-sm text-muted mb-4">{notification.time}</p>
            <div
              style={{
                background: 'var(--bg-main)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                borderLeft: `4px solid ${getColor(notification.uiType)}`,
              }}
            >
              <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{notification.message}</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <h3 className="h3 mb-4">Details</h3>
          <p className="text-sm text-muted">Type: {notification.typeLabel}</p>
          <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
            Status: {notification.isRead ? 'Read' : 'Unread'}
          </p>
        </div>
      </div>
    </div>
  );
};
