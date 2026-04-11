import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDepartments } from '../context/DepartmentContext';
import { useEmployees } from '../context/EmployeeContext';

export const DepartmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { departments, addDepartment, updateDepartment } = useDepartments();
  const { employees, updateEmployee } = useEmployees();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    headEmployeeId: '',
  });
  
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const dept = departments.find(d => d.id === id);
      if (dept) {
        setFormData({ name: dept.name, code: dept.code, headEmployeeId: dept.headEmployeeId || '' });
        // Find existing assigned employees
        const existingEmps = employees.filter(e => e.departmentId === id).map(e => e.id);
        setSelectedEmployees(existingEmps);
      }
    }
  }, [id, isEditing, departments, employees]);

  // We consider eligible heads to be those holding Manager/Director type designators.
  const eligibleHeads = employees.filter(e => e.designation.toLowerCase().includes('manager') || e.designation.toLowerCase().includes('director'));

  const toggleEmployeeSelection = (empId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      setError('Name and Code are required properties.');
      return;
    }

    setIsSaving(true);

    try {
      let targetDeptId = id;

      if (!isEditing) {
        targetDeptId = 'dept_' + Math.random().toString(36).substr(2, 9);
        await addDepartment({
          id: targetDeptId,
          name: formData.name,
          code: formData.code,
          headEmployeeId: formData.headEmployeeId || undefined,
        } as any);
      } else if (targetDeptId) {
        await updateDepartment(targetDeptId, {
          name: formData.name,
          code: formData.code,
          headEmployeeId: formData.headEmployeeId || undefined,
        });
      }

      // 2. Loop through all explicitly selected employees and forcibly re-assign their department bounds
      if (selectedEmployees.length > 0 && targetDeptId) {
        for (const empId of selectedEmployees) {
          await updateEmployee(empId, { departmentId: targetDeptId });
        }
      }
      
      // If we assigned a head, also ensure they are in this department officially
      if (formData.headEmployeeId && !selectedEmployees.includes(formData.headEmployeeId) && targetDeptId) {
         await updateEmployee(formData.headEmployeeId, { departmentId: targetDeptId });
      }

      navigate('/admin/departments');
    } catch (err) {
      setError('An error occurred whilst creating the department structure.');
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="h1">{isEditing ? 'Edit Department' : 'Add New Department'}</h1>
        <p className="text-muted text-sm">{isEditing ? 'Modify organizational boundaries and reassess members.' : 'Create a new organizational boundary and populate it immediately.'}</p>
      </div>

      <div className="card">
        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <h3 className="h3" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Core Details</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Department Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Product Engineering"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department Code</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. ENG-01"
                value={formData.code}
                onChange={(e) => setFormData(p => ({ ...p, code: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Department Head (Optional)</label>
            <select 
               className="form-input"
               value={formData.headEmployeeId}
               onChange={(e) => setFormData(p => ({ ...p, headEmployeeId: e.target.value }))}
            >
              <option value="">-- No Head Assigned --</option>
              {eligibleHeads.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.designation})</option>
              ))}
            </select>
            <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>The assigned head will automatically be drafted into this department upon saving.</p>
          </div>

          <h3 className="h3" style={{ marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Employee Roster Assignment</h3>
          <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>Select existing employees below to instantly migrate their bounds into this new department upon creation.</p>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', background: 'var(--bg-main)' }}>
             {employees.map(emp => (
               <label key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => toggleEmployeeSelection(emp.id)}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: 500 }}>{emp.firstName} {emp.lastName}</div>
                    <div className="text-xs text-muted">{emp.designation}</div>
                  </div>
               </label>
             ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', gap: '1rem' }}>
             <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSaving}>
                {isSaving ? <span className="spinner" style={{ width: '16px', height: '16px' }}/> : 'Confirm & Save'}
             </button>
             <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/departments')} style={{ flex: 1 }} disabled={isSaving}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
