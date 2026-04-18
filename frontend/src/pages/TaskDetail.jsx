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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                  <div 
                    onClick={() => employees?.length > 0 && setIsDropdownOpen(!isDropdownOpen)}
                    style={{ 
                      padding: '0.625rem', 
                      background: 'var(--bg-surface)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-md)', 
                      cursor: employees?.length > 0 ? 'pointer' : 'not-allowed',
                      minHeight: '42px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}
                  >
                    {selectedAssigneeIds.length === 0 ? (
                      <span style={{ color: 'var(--text-muted)' }}>{employees?.length > 0 ? 'Select assignees...' : 'No employees available'}</span>
                    ) : (
                      selectedAssigneeIds.map(id => {
                        const emp = employees?.find(e => e.id === id);
                        return (
                          <span key={id} style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>
                            {emp?.fullName || 'Unknown'}
                          </span>
                        )
                      })
                    )}
                  </div>

                  {isDropdownOpen && employees?.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
                      background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)', zIndex: 50, maxHeight: '240px', display: 'flex', flexDirection: 'column'
                    }}>
                      <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', background: 'var(--bg-main)' }}
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                      <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem' }}>
                        {employees
                          .filter(emp => (emp.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(emp => {
                            const isSelected = selectedAssigneeIds.includes(emp.id);
                            return (
                              <div 
                                key={emp.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isSelected) {
                                     setSelectedAssigneeIds(prev => prev.filter(p => p !== emp.id));
                                  } else {
                                     setSelectedAssigneeIds(prev => [...prev, emp.id]);
                                  }
                                }}
                                style={{
                                  padding: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                  background: isSelected ? 'var(--bg-subtle)' : 'transparent',
                                  borderRadius: 'var(--radius-sm)'
                                }}
                              >
                                 <input type="checkbox" checked={isSelected} readOnly style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }} />
                                 <span style={{ fontWeight: isSelected ? 600 : 400, color: 'var(--text-main)', fontSize: '0.9375rem' }}>{emp.fullName}</span>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  )}
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