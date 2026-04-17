import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, PlusCircle, User } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import { usePositions } from '../context/PositionContext';
import { useDepartments } from '../context/DepartmentContext';
import {
  getDepartmentNameById,
  getEmployeeStatusBadge,
  getEmployeeStatusLabel,
  getPositionTitleById,
} from '../utils/org';

export const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addEmployee, getEmployeeById, updateEmployee, updateEmployeeStatus, employees } = useEmployees();
  const { positions } = usePositions();
  const { departments } = useDepartments();

  const isEditMode = Boolean(id);
  const existingEmployee = useMemo(() => getEmployeeById(id), [getEmployeeById, id]);

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hireDate: new Date().toISOString().split('T')[0],
    positionId: '',
    managerId: '',
    status: 'ACTIVE',
    role: 'EMPLOYEE'
  });

  const availablePositions = useMemo(() => {
    return positions.filter((pos) => {
      const isUsed = employees.some((emp) => emp.positionId === pos.id);

      if (isEditMode && existingEmployee?.positionId == pos.id) {
        return true;
      }

      return !isUsed;
    });
  }, [positions, employees, existingEmployee, isEditMode]);



  useEffect(() => {
    if (existingEmployee) {
      // availablePositions.push(
      //   positions.filter((pos)=> pos.id == existingEmployee.positionId)
      // );
      setFormData({
        employeeCode: existingEmployee.employeeCode || '',
        firstName: existingEmployee.firstName || '',
        lastName: existingEmployee.lastName || '',
        email: existingEmployee.email || '',
        phone: existingEmployee.phone || '',
        hireDate: existingEmployee.hireDate || new Date().toISOString().split('T')[0],
        positionId: existingEmployee.positionId ? String(existingEmployee.positionId) : '',
        managerId: existingEmployee.managerId ? String(existingEmployee.managerId) : '',
        status: existingEmployee.status || 'ACTIVE',
        role: existingEmployee.role || 'EMPLOYEE',

      });
    }
  }, [existingEmployee]);

  const selectedPosition = positions.find((position) => position.id == formData.positionId);
  const derivedDepartment = departments.find((department) => department.id == selectedPosition?.departmentId);
  const managerOptions = employees.filter((employee) => employee.id != id);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (event) => {
    event.preventDefault();
    if (!selectedPosition) {
      setError('Please select a position before continuing.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {

      const selectedPosition = positions.find((position) => position.id == formData.positionId);
      
      if (!selectedPosition) {
        alert('Please select a valid position');
      }

      const payload = {
        employeeCode: (formData.employeeCode || currentEmployeeCode || '').trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        hireDate: formData.hireDate,
        positionId: Number(formData.positionId),
        departmentId: selectedPosition.departmentId,
        managerId: formData.managerId ? Number(formData.managerId) : null,
        role: formData.role
    };

    let savedEmployee;
    if (isEditMode && id) {
      savedEmployee = await updateEmployee(id, payload);
    } else {
      savedEmployee = await addEmployee(payload);
    }

    if (formData.status && formData.status !== savedEmployee.status) {
      await updateEmployeeStatus(savedEmployee.id, formData.status);
    }

      navigate('/admin/employees');
    } catch (err) {
      setError(err.message || 'Failed to save employee');
      setIsSaving(false);
    }
  };

  const managerName = formData.managerId
    ? employees.find((employee) => employee.id == formData.managerId)?.fullName ||
      employees.find((employee) => employee.id == formData.managerId)?.firstName
    : 'None';

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="h1">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
        <p className="text-muted">
          Fill out the information below to {isEditMode ? 'update' : 'create'} an employee profile.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step === 1 ? 'var(--primary)' : 'var(--success)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step === 1 ? 'var(--primary)' : 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {step === 2 ? <Check size={16} /> : 1}
          </div>
          <span style={{ fontWeight: 500 }}>Employee Details</span>
        </div>
        <div style={{ flex: 1, height: '2px', background: step === 2 ? 'var(--success)' : 'var(--border-color)', margin: '0 1rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step === 2 ? 'var(--primary)' : 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step === 2 ? 'var(--primary)' : 'var(--bg-subtle)', color: step === 2 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            2
          </div>
          <span style={{ fontWeight: 500 }}>Review & Save</span>
        </div>
      </div>

      <div className="card">
        {error && (
          <div style={{ padding: '0.875rem 1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Employee Code *</label>
                <input required name="employeeCode" value={formData.employeeCode} onChange={handleChange} className="form-input" placeholder="EMP001" />
              </div>
              <div className="form-group">
                <label className="form-label">Hire Date *</label>
                <input required type="date" name="hireDate" value={formData.hireDate} onChange={handleChange} className="form-input" />
              </div>
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
                <label className="form-label">Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="555-0100" />
              </div>

              <div style={{ gridColumn: '1 / -1', height: '1px', background: 'var(--border-color)' }} />

              

              <div className="form-group">
                <label className="form-label">Position *</label>
                <select required name="positionId" value={formData.positionId} onChange={handleChange} className="form-input">
                  <option value="">Select position</option>
                  {availablePositions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.title} ({getDepartmentNameById(departments, position.departmentId)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input value={derivedDepartment ? `${derivedDepartment.name} (${derivedDepartment.code})` : 'Select a position first'} className="form-input" readOnly />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-start' }}>
                <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/positions/new')}>
                  <PlusCircle size={16} /> Create New Position
                </button>
              </div>


              <div className="form-group">
                <label className="form-label">Manager</label>
                <select name="managerId" value={formData.managerId} onChange={handleChange} className="form-input">
                  <option value="">None (Top Level)</option>
                  {managerOptions.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullName || `${employee.firstName} ${employee.lastName}`} ({getPositionTitleById(positions, employee.positionId)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </div>

              {!isEditMode && (
                <>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p>User Login details</p>
                  </div>

                  <div
                    style={{
                      gridColumn: '1 / -1',
                      height: '1px',
                      background: 'var(--border-color)',
                      marginBottom: '1rem',
                    }}
                  />

                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input value={formData.employeeCode} className="form-input" readOnly />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input value={formData.employeeCode} className="form-input" readOnly />
                  </div>

                  <div className="form-group">
                    <label className="form-label">UserRole</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </>
              )}


              
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
              <div>
                <p className="text-sm text-muted">Employee Code , Username, Password</p>
                <p style={{ fontWeight: 500 }}>{formData.employeeCode}</p>
              </div>
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
                <p style={{ fontWeight: 500 }}>{formData.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Status</p>
                <p><span className={`badge badge-${getEmployeeStatusBadge(formData.status)}`}>{getEmployeeStatusLabel(formData.status)}</span></p>
              </div>
              <div style={{ gridColumn: '1 / -1', height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
              <div>
                <p className="text-sm text-muted">Position</p>
                <p style={{ fontWeight: 500 }}>{selectedPosition?.title || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Department</p>
                <p style={{ fontWeight: 500 }}>{derivedDepartment?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Manager</p>
                <p style={{ fontWeight: 500 }}>{managerName || 'None'}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Hire Date</p>
                <p style={{ fontWeight: 500 }}>{formData.hireDate}</p>
              </div>

              <div>
                <p className="text-sm text-muted">Role </p>
                <p style={{ fontWeight: 500 }}>{formData.role}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} disabled={isSaving}>
                Back to Edit
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Confirm & Create'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
