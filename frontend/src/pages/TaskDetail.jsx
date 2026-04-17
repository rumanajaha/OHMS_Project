import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useEmployees } from '../context/EmployeeContext';
import { ArrowLeft, Edit2, Save, Trash2, Calendar, User, AlignLeft, Flag, CheckCircle } from 'lucide-react';

export const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTask, deleteTask, assignTask, isLoading } = useTasks();
  const { user } = useAuth();
  const { employees } = useEmployees();
  
  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const task = id ? getTaskById(id) : undefined;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setEditedTask(task);
    if (task && task.assignees) {
      setSelectedAssigneeIds(task.assignees.map(a => Number(a.employeeId)));
    }
  }, [task]);

  if (isLoading && !task) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

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
      try {
        await updateTask(id, editedTask);
        
        const originalAssigneeIds = task?.assignees?.map(a => Number(a.employeeId)) || [];
        const hasAssigneesChanged = 
          selectedAssigneeIds.length !== originalAssigneeIds.length ||
          !selectedAssigneeIds.every(ai => originalAssigneeIds.includes(ai));

        if (hasAssigneesChanged) {
          await assignTask(id, selectedAssigneeIds);
        }
        
        setIsEditing(false);
      } catch (err) {
        window.alert('Failed to save task: Access denied or network error.');
      }
    }
  };

  const handleDelete = async () => {
    if (id && window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        navigate(-1);
      } catch (err) {
        window.alert('Action Blocked: You do not have permission to delete tasks.');
      }
    }
  };

  const priorityColors = {
    HIGH: 'var(--danger)',
    MEDIUM: 'var(--warning)',
    LOW: 'var(--success)',
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
            {isEditing && canEdit && (
              <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Save</button>
            )}
            {!isEditing && canEdit && (
              <button className="btn btn-secondary" onClick={() => setIsEditing(true)}><Edit2 size={16} /> Edit</button>
            )}
            {canEdit && (
              <button className="btn btn-ghost text-danger" onClick={handleDelete}><Trash2 size={16} /></button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <User size={18} className="text-muted" />
            <div>
              <p className="text-xs text-muted">Assignee</p>
              {isEditing ? (
                <div style={{ position: 'relative', marginTop: '0.25rem' }}>
                  <input 
                    type="text" 
                    className="form-input mb-2" 
                    placeholder="Search employees..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    style={{ padding: '0.25rem' }} 
                    disabled={!employees || employees.length === 0}
                  />
                  {(!employees || employees.length === 0) ? (
                    <div style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
                      No employees available (or access denied)
                    </div>
                  ) : (
                    <select 
                       className="form-input" 
                       multiple 
                       value={selectedAssigneeIds} 
                       onChange={(e) => {
                         const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                         setSelectedAssigneeIds(values);
                       }}
                       style={{ padding: '0.25rem', height: '100px' }}>
                      {employees
                        .filter(emp => (emp.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                      ))}
                    </select>
                  )}
                  {employees && employees.length > 0 && <p className="text-xs text-muted mt-1">Hold Cmd/Ctrl to select multiple</p>}
                </div>
              ) : (
                <p style={{ fontWeight: 500 }}>{task.assignees?.map(a => a.employeeName).join(', ') || 'Unassigned'}</p>
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
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              ) : (
                <span className="badge badge-neutral text-xs" style={{ background: 'var(--bg-subtle)', color: priorityColors[task.priority?.toUpperCase()], fontWeight: 600 }}>{task.priority}</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={18} className="text-muted" />
            <div>
              <p className="text-xs text-muted">Status</p>
              {isEditing ? (
                <select className="form-input" value={editedTask.status} onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })} style={{ padding: '0.25rem' }}>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Completed</option>
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


      </div>
    </div>
  );
};