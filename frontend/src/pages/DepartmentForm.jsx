import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDepartments } from '../context/DepartmentContext';
import { useEmployees } from '../context/EmployeeContext';
import { usePositions } from '../context/PositionContext';
import { getEmployeeFullName, getPositionTitleById } from '../utils/org';

export const DepartmentForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { departments, addDepartment, updateDepartment } = useDepartments();
  const { employees } = useEmployees();
  const { positions } = usePositions();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    headEmployeeId: '',
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing || !id) return;

    const department = departments.find((entry) => String(entry.id) === String(id));
    if (department) {
      setFormData({
        name: department.name || '',
        code: department.code || '',
        headEmployeeId: department.head?.id ? String(department.head.id) : '',
      });
    }
  }, [departments, id, isEditing]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setError('Name and Code are required properties.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        headEmployeeId: formData.headEmployeeId ? Number(formData.headEmployeeId) : undefined,
      };

      if (isEditing && id) {
        await updateDepartment(id, payload);
      } else {
        await addDepartment(payload);
      }

      navigate('/admin/departments');
    } catch (err) {
      setError(err.message || 'An error occurred whilst saving the department.');
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="h1">{isEditing ? 'Edit Department' : 'Add New Department'}</h1>
        <p className="text-muted text-sm">
          {isEditing
            ? 'Update department details and leadership assignment.'
            : 'Create a department container for positions and reporting lines.'}
        </p>
      </div>

      <div className="card">
        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--danger)',
              color: 'white',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h3
            className="h3"
            style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}
          >
            Core Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Department Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Product Engineering"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ENG-01"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Department Head (Optional)</label>
            <select
              className="form-input"
              value={formData.headEmployeeId}
              onChange={(e) => setFormData((prev) => ({ ...prev, headEmployeeId: e.target.value }))}
            >
              <option value="">-- No Head Assigned --</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {getEmployeeFullName(employee)} ({getPositionTitleById(positions, employee.positionId)})
                </option>
              ))}
            </select>
            <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
              Department nesting stays hidden in the current UI; this screen manages only the flat department record.
            </p>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.5rem',
              marginTop: '2rem',
              display: 'flex',
              gap: '1rem',
            }}
          >
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSaving}>
              {isSaving ? (
                <span className="spinner" style={{ width: '16px', height: '16px' }} />
              ) : (
                'Confirm & Save'
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin/departments')}
              style={{ flex: 1 }}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
