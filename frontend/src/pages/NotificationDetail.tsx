import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotifications, type NotificationType } from '../context/NotificationContext';
import { ArrowLeft, Clock, ShieldAlert, CheckCircle, Info, Send } from 'lucide-react';

export const NotificationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNotificationById, replyToNotification } = useNotifications();
  
  const notification = id ? getNotificationById(id) : undefined;
  const [replyText, setReplyText] = useState('');

  if (!notification) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 className="h2 text-muted">Notification not found</h2>
        <button className="btn btn-secondary mt-4" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'warning': return <Clock size={24} />;
      case 'success': return <CheckCircle size={24} />;
      case 'danger': return <ShieldAlert size={24} />;
      default: return <Info size={24} />;
    }
  };

  const getColor = (type: NotificationType) => {
    return `var(--${type})`;
  };

  const handleReply = async () => {
    if (id && replyText.trim()) {
      await replyToNotification(id, replyText.trim());
      setReplyText('');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <button className="btn btn-ghost" style={{ padding: '0', marginBottom: '1.5rem', color: 'var(--text-muted)' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back to Notifications
      </button>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `rgba(var(--${notification.type}-rgb), 0.1)`, backgroundColor: 'var(--bg-subtle)', color: getColor(notification.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {getIcon(notification.type)}
          </div>
          <div>
            <h1 className="h2" style={{ marginBottom: '0.5rem' }}>{notification.title}</h1>
            <p className="text-sm text-muted mb-4">{notification.time}</p>
            <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${getColor(notification.type)}` }}>
              <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{notification.message}</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <h3 className="h3 mb-4">Replies</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {notification.replies.length === 0 ? (
              <p className="text-muted text-sm italic">No replies yet.</p>
            ) : (
              notification.replies.map((reply, index) => (
                <div key={index} style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>ME</div>
                    <span className="text-sm font-medium">You</span>
                    <span className="text-xs text-muted ml-auto">Just now</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-main)' }}>{reply}</p>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Type your reply..." 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleReply()}
            />
            <button className="btn btn-primary" onClick={handleReply} disabled={!replyText.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
