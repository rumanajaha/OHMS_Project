import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDepartments } from '../context/DepartmentContext';
import { usePositions } from '../context/PositionContext';

export const PositionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { departments } = useDepartments();
  const { positions, addPosition, updatePosition } = usePositions();

  const existingPosition = useMemo(() => positions.find((position) => position.id == id), [positions, id]);

  const [formData, setFormData] = useState({
    title: existingPosition?.title || '',
    code: existingPosition?.code || '',
    departmentId: existingPosition?.departmentId ? String(existingPosition.departmentId) : '',
    parentPositionId: existingPosition?.parentPositionId ? String(existingPosition.parentPositionId) : '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const availableParentPositions = positions.filter((position) => position.id != id);

  React.useEffect(() => {
    if (existingPosition) {
      setFormData({
        title: existingPosition.title || '',
        departmentId: existingPosition.departmentId ? String(existingPosition.departmentId) : '',
        parentPositionId: existingPosition.parentPositionId ? String(existingPosition.parentPositionId) : '',
      });
    }
  }, [existingPosition]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    const payload = {
      title: formData.title.trim(),
      departmentId: Number(formData.departmentId),
      parentPositionId: formData.parentPositionId ? Number(formData.parentPositionId) : null,
      code: formData.code
    };

    try {
      if (isEditMode) {
        await updatePosition(id, payload);
      } else {
        await addPosition(payload);
      }
      navigate('/admin/positions');
    } catch (err) {
      setError(err.message || 'Failed to save position');
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="h1">{isEditMode ? 'Edit Position' : 'Add New Position'}</h1>
        <p className="text-muted">
          {isEditMode ? 'Update the reporting role details below.' : 'Create a new position for employee assignment.'}
        </p>
      </div>

      <div className="card">
        {error && (
          <div
            style={{
              padding: '0.875rem 1rem',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Position Title *</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Software Engineer"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Position Code</label>
              <input
                type="text"
                name="code"
                className="form-input"
                placeholder="e.g. SDE1"
                value={formData.code}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                required
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Parent Position</label>
              <select
                name="parentPositionId"
                value={formData.parentPositionId}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">None</option>
                {availableParentPositions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/positions')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Position'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
