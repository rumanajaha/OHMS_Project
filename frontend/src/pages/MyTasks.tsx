import React from 'react';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

export const MyTasks: React.FC = () => {
  const tasks = [
    { id: 1, title: 'Complete Onboarding Course Phase 1', status: 'Completed', date: '2026-04-01' },
    { id: 2, title: 'Submit Q1 Objectives and Key Results', status: 'In Progress', date: '2026-04-10' },
    { id: 3, title: 'Compliance and Security Training', status: 'Pending', date: '2026-04-15' },
    { id: 4, title: 'Update LinkedIn Profile for Company Page', status: 'Pending', date: '2026-04-20' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="h1">My Tasks</h1>
        <p className="text-muted">Keep track of your assigned activities and their statuses.</p>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {tasks.map((task, index) => {
          let StatusIcon = AlertCircle;
          let color = 'var(--text-muted)';
          
          if (task.status === 'Completed') {
            StatusIcon = CheckSquare;
            color = 'var(--success)';
          } else if (task.status === 'In Progress') {
            StatusIcon = Clock;
            color = 'var(--warning)';
          }

          return (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: index < tasks.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StatusIcon size={20} style={{ color }} />
                <div>
                  <h4 style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{task.title}</h4>
                  <span className="text-xs text-muted">Due date: {task.date}</span>
                </div>
              </div>
              <div>
                <span className={`badge badge-${task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'warning' : 'neutral'}`}>
                  {task.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
