import React, { useState } from 'react';
import { Plus, MoreHorizontal, Calendar, Trash2, Eye } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const TaskManagement = () => {
  const { tasks, addTask, deleteTask } = useTasks();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleNewTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask({
      title: newTaskTitle,
      description: '',
      priority: 'MEDIUM',
      dueDate: new Date().toISOString().split('T')[0],
      assignedByEmployeeId: user?.employeeId,
      assigneeIds: [],
    });
    setNewTaskTitle('');
    setIsModalOpen(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'var(--danger)';
      case 'MEDIUM': return 'var(--warning)';
      case 'LOW': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  const columns = [
    { label: 'To Do', value: 'TODO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'DONE' }
  ];
  const basePath = user?.role === 'ADMIN' ? '/admin' : user?.role === 'MANAGER' ? '/manager' : '/employee';

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="h1">Task Management</h1>
          <p className="text-muted text-sm">Organize and track tasks across your teams.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Task
        </button>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 className="h2">Create New Task</h2>
            <div className="form-group mb-0">
              <label className="form-label">Task Title</label>
              <input type="text" className="form-input" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} autoFocus />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleNewTask}>Create</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflowX: 'auto', paddingBottom: '1rem' }}>
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.value);
          return (
            <div key={column.value} style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h3 className="h3" style={{ margin: 0 }}>{column.label}</h3>
                  <span style={{ background: 'var(--bg-surface)', padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
                {columnTasks.map((task) => (
                  <div key={task.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="badge badge-neutral text-xs" style={{ background: 'var(--bg-subtle)', color: getPriorityColor(task.priority), fontWeight: 600 }}>
                        {task.priority}
                      </span>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }} onClick={() => setDropdownOpen(dropdownOpen === task.id ? null : task.id)}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    {dropdownOpen === task.id && (
                      <div style={{ position: 'absolute', top: '2.5rem', right: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', zIndex: 20 }}>
                        <button style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' }} onClick={() => { setDropdownOpen(null); navigate(`${basePath}/tasks/${task.id}`); }}>
                          <Eye size={14} /> View Details
                        </button>
                        <button style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--danger)' }} onClick={async () => { if (window.confirm('Delete Task?')) await deleteTask(task.id); setDropdownOpen(null); }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}

                    <p style={{ fontWeight: 500, fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.4, cursor: 'pointer' }} onClick={() => navigate(`${basePath}/tasks/${task.id}`)}>
                      {task.title}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 600 }}>
                          {task.assignee.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <span className="text-xs text-muted">{task.assignee}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)' }}>
                        <Calendar size={12} />
                        <span className="text-xs">{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    No tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};