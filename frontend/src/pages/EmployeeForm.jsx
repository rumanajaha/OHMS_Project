import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { Check, ChevronRight, User } from 'lucide-react';

export const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addEmployee, getEmployeeById, updateEmployee, employees } = useEmployees();
  const { departments } = useDepartments();

  const isEditMode = !!id;
  const existingEmp = id ? getEmployeeById(id) : null;

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: existingEmp?.firstName || '',
    lastName: existingEmp?.lastName || '',
    email: existingEmp?.email || '',
    phone: existingEmp?.phone || '',
    hireDate: existingEmp?.hireDate || new Date().toISOString().split('T')[0],
    departmentId: existingEmp?.departmentId || (departments[0]?.id ?? ''),
    managerId: existingEmp?.managerId || '',
    designation: existingEmp?.designation || '',
    status: existingEmp?.status || 'Active',
    skills: existingEmp?.skills || [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (isEditMode && id) {
      await updateEmployee(id, formData);
    } else {
      await addEmployee(formData);
    }
    setIsSaving(false);
    navigate('/admin/employees');
  };

  const departmentName = departments.find((d) => d.id === formData.departmentId)?.name;
  const managerName = formData.managerId
    ? employees.find((e) => e.id === formData.managerId)?.firstName
    : 'None';

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="h1">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
        <p className="text-muted">
          Fill out the information below to {isEditMode ? 'update' : 'create'} an employee profile.
        </p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: step === 1 ? 'var(--primary)' : 'var(--success)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step === 1 ? 'var(--primary)' : 'var(--success)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            {step === 2 ? <Check size={16} /> : 1}
          </div>
          <span style={{ fontWeight: 500 }}>Employee Details</span>
        </div>
        <div
          style={{
            flex: 1,
            height: '2px',
            background: step === 2 ? 'var(--success)' : 'var(--border-color)',
            margin: '0 1rem',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: step === 2 ? 'var(--primary)' : 'var(--text-muted)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step === 2 ? 'var(--primary)' : 'var(--bg-subtle)',
              color: step === 2 ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            2
          </div>
          <span style={{ fontWeight: 500 }}>Review & Save</span>
        </div>
      </div>

      <div className="card">
        {step === 1 ? (
          <form onSubmit={handleNext}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" placeholder="John" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" placeholder="Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="john.doe@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="555-0100" />
              </div>

              <div style={{ gridColumn: '1 / -1', height: '1px', background: 'var(--border-color)', margin: '1rem 0' }} />

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select required name="departmentId" value={formData.departmentId} onChange={handleChange} className="form-input">
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Designation *</label>
                <input required name="designation" value={formData.designation} onChange={handleChange} className="form-input" placeholder="Software Engineer" />
              </div>
              <div className="form-group">
                <label className="form-label">Manager</label>
                <select name="managerId" value={formData.managerId} onChange={handleChange} className="form-input">
                  <option value="">None (Top Level)</option>
                  {employees
                    .filter((e) => e.id !== id)
                    .map((e) => (
                      <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.designation})</option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Hire Date *</label>
                <input required type="date" name="hireDate" value={formData.hireDate} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Status *</label>
                <select required name="status" value={formData.status} onChange={handleChange} className="form-input">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/employees')}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                Next Step <ChevronRight size={16} />
              </button>
            </div>
          </form>
        ) : (
          <div className="animate-fade-in">
            <h3 className="h3" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} className="text-primary" /> Review Details
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                background: 'var(--bg-subtle)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
              }}
            >
              <div>
                <p className="text-sm text-muted">Full Name</p>
                <p style={{ fontWeight: 500 }}>{formData.firstName} {formData.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Email Address</p>
                <p style={{ fontWeight: 500 }}>{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Phone Number</p>
                <p style={{ fontWeight: 500 }}>{formData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Status</p>
                <p>
                  <span className={`badge badge-${formData.status === 'Active' ? 'success' : 'warning'}`}>
                    {formData.status}
                  </span>
                </p>
              </div>

              <div style={{ gridColumn: '1 / -1', height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />

              <div>
                <p className="text-sm text-muted">Department</p>
                <p style={{ fontWeight: 500 }}>{departmentName}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Designation</p>
                <p style={{ fontWeight: 500 }}>{formData.designation}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Manager</p>
                <p style={{ fontWeight: 500 }}>{managerName || 'None'}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Hire Date</p>
                <p style={{ fontWeight: 500 }}>{formData.hireDate}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} disabled={isSaving}>
                Back to Edit
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <span className="spinner" style={{ width: '16px', height: '16px' }} />
                ) : isEditMode ? (
                  'Save Changes'
                ) : (
                  'Confirm & Create'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};