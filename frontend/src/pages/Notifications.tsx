import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle, Clock, Eye, EyeOff, MessageSquare, Send } from 'lucide-react';
import { useNotifications, type NotificationType } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Notifications: React.FC = () => {
  const { notifications, markAllAsRead, markAsRead, markAsUnread, replyToNotification } = useNotifications();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const basePath = user?.role === 'Manager' || user?.role === 'Admin' ? '/manager' : '/employee';

  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'warning': return <Clock size={20} />;
      case 'success': return <CheckCircle size={20} />;
      case 'danger': return <ShieldAlert size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(id);
    }
    navigate(`${basePath}/notifications/${id}`);
  };

  const handleToggleRead = async (e: React.MouseEvent, note: any) => {
    e.stopPropagation();
    if (note.isRead) {
      await markAsUnread(note.id);
    } else {
      await markAsRead(note.id);
    }
  };

  const handleReplyToggle = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    setActiveReplyId(activeReplyId === noteId ? null : noteId);
    setReplyText('');
  };

  const handleSendReply = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (replyText.trim()) {
      await replyToNotification(noteId, replyText.trim());
      setActiveReplyId(null);
      setReplyText('');
    }
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
        {notifications.map(note => (
          <div 
             key={note.id} 
             className="card" 
             style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', borderLeft: note.isRead ? 'none' : `3px solid var(--${note.type})` }}
             onClick={() => handleNotificationClick(note.id, note.isRead)}
          >
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `rgba(var(--${note.type}-rgb), 0.1)`, backgroundColor: 'var(--bg-subtle)', color: `var(--${note.type})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {getIcon(note.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontWeight: note.isRead ? 500 : 700, fontSize: '0.9375rem', color: 'var(--text-main)', fontFamily: 'Poppins, sans-serif' }}>{note.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {!note.isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
                    <span className="text-xs text-muted">{note.time}</span>
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {note.message}
                </p>
                
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-ghost text-xs" style={{ padding: '0.25rem 0.5rem', color: 'var(--text-muted)' }} onClick={(e) => handleToggleRead(e, note)}>
                    {note.isRead ? <EyeOff size={14} style={{ marginRight: '0.375rem' }} /> : <Eye size={14} style={{ marginRight: '0.375rem' }} />}
                    {note.isRead ? 'Mark as unread' : 'Mark as read'}
                  </button>
                  <button className="btn btn-ghost text-xs" style={{ padding: '0.25rem 0.5rem', color: 'var(--primary)' }} onClick={(e) => handleReplyToggle(e, note.id)}>
                    <MessageSquare size={14} style={{ marginRight: '0.375rem' }} /> Reply
                  </button>
                </div>

                {activeReplyId === note.id && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }} onClick={e => e.stopPropagation()}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Type your reply..." 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendReply(e as any, note.id);
                      }}
                      autoFocus
                    />
                    <button className="btn btn-primary" onClick={(e) => handleSendReply(e, note.id)} disabled={!replyText.trim()}>
                      <Send size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
