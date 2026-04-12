import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { ArrowLeft, Edit2, Save, Trash2, Calendar, User, AlignLeft, Flag, CheckCircle } from 'lucide-react';

export const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTask, deleteTask } = useTasks();

  const task = id ? getTaskById(id) : undefined;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  if (!task || !editedTask) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 className="h2 text-muted">Task not found</h2>
        <button className="btn btn-secondary mt-4" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handleSave = async () => {
    if (id && editedTask) {
      await updateTask(id, editedTask);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (id && window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      navigate(-1);
    }
  };

  const priorityColors = {
    High: 'var(--danger)',
    Medium: 'var(--warning)',
    Low: 'var(--success)',
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <button className="btn btn-ghost" style={{ padding: '0', marginBottom: '1.5rem', color: 'var(--text-muted)' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back to Tasks
      </button>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, marginRight: '1rem' }}>
            {isEditing ? (
              <input type="text" className="form-input" value={editedTask.title} onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })} style={{ fontSize: '1.5rem', fontWeight: 600, padding: '0.5rem' }} />
            ) : (
              <h1 className="h1">{task.title}</h1>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {isEditing ? (
              <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Save</button>
            ) : (
              <button className="btn btn-secondary" onClick={() => setIsEditing(true)}><Edit2 size={16} /> Edit</button>
            )}
            <button className="btn btn-ghost text-danger" onClick={handleDelete}><Trash2 size={16} /></button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <User size={18} className="text-muted" />
            <div>
              <p className="text-xs text-muted">Assignee</p>
              {isEditing ? (
                <input type="text" className="form-input" value={editedTask.assignee} onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })} style={{ padding: '0.25rem' }} />
              ) : (
                <p style={{ fontWeight: 500 }}>{task.assignee}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={18} className="text-muted" />
            <div>
              <p className="text-xs text-muted">Due Date</p>
              {isEditing ? (
                <input type="text" className="form-input" value={editedTask.dueDate} onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })} style={{ padding: '0.25rem' }} />
              ) : (
                <p style={{ fontWeight: 500 }}>{task.dueDate}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Flag size={18} className="text-muted" />
            <div>
              <p className="text-xs text-muted">Priority</p>
              {isEditing ? (
                <select className="form-input" value={editedTask.priority} onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })} style={{ padding: '0.25rem' }}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              ) : (
                <span className="badge badge-neutral text-xs" style={{ background: 'var(--bg-subtle)', color: priorityColors[task.priority], fontWeight: 600 }}>{task.priority}</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={18} className="text-muted" />
            <div>
              <p className="text-xs text-muted">Status</p>
              {isEditing ? (
                <select className="form-input" value={editedTask.status} onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })} style={{ padding: '0.25rem' }}>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              ) : (
                <span style={{ fontWeight: 500 }}>{task.status}</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <AlignLeft size={18} className="text-muted" />
            <h3 className="h3">Description</h3>
          </div>
          {isEditing ? (
            <textarea className="form-input" rows={5} value={editedTask.description} onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} />
          ) : (
            <p style={{ color: 'var(--text-main)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {task.description || 'No description provided.'}
            </p>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="h3 text-sm">Progress</h3>
            <span className="text-sm font-medium">{isEditing ? editedTask.progress : task.progress}%</span>
          </div>
          {isEditing ? (
            <input type="range" min="0" max="100" value={editedTask.progress} onChange={(e) => setEditedTask({ ...editedTask, progress: parseInt(e.target.value) })} style={{ width: '100%' }} />
          ) : (
            <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${task.progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};