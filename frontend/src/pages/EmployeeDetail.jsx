import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Mail, Phone, Briefcase, Calendar } from 'lucide-react';

export const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const { user } = useAuth();

  const employee = employees.find((e) => e.id === id);

  if (!employee) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 className="h2" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Employee Not Found</h2>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const department = departments.find((d) => d.id === employee.departmentId);
  const manager = employees.find((e) => e.id === employee.managerId);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <button className="btn btn-ghost" style={{ marginBottom: '1.5rem', padding: '0.5rem 0' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ background: 'var(--primary)', height: '120px' }}></div>
        <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 600,
              border: '4px solid var(--bg-surface)',
              marginTop: '-50px',
              marginBottom: '1rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {employee.firstName.charAt(0)}
            {employee.lastName.charAt(0)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="h1" style={{ marginBottom: '0.25rem' }}>
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-lg text-muted">{employee.designation}</p>
            </div>
            <span className={`badge badge-${employee.status === 'Active' ? 'success' : 'neutral'}`}>
              {employee.status}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginTop: '2.5rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Mail className="text-muted" size={20} />
                <div>
                  <p className="text-xs text-muted mb-1 text-uppercase tracking-wide">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Phone className="text-muted" size={20} />
                <div>
                  <p className="text-xs text-muted mb-1 text-uppercase tracking-wide">Phone</p>
                  <p className="font-medium">{employee.phone || 'Not provided'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <User className="text-muted" size={20} />
                <div>
                  <p className="text-xs text-muted mb-1 text-uppercase tracking-wide">Employee ID</p>
                  <p className="font-medium" style={{ fontFamily: 'monospace' }}>{employee.id}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Briefcase className="text-muted" size={20} />
                <div>
                  <p className="text-xs text-muted mb-1 text-uppercase tracking-wide">Department</p>
                  <p className="font-medium">{department?.name || 'Unassigned'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <User className="text-muted" size={20} />
                <div>
                  <p className="text-xs text-muted mb-1 text-uppercase tracking-wide">Manager</p>
                  <p className="font-medium">
                    {manager ? `${manager.firstName} ${manager.lastName}` : 'N/A'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Calendar className="text-muted" size={20} />
                <div>
                  <p className="text-xs text-muted mb-1 text-uppercase tracking-wide">Employment Status</p>
                  <p className="font-medium">Full-Time Worker</p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '2rem',
              marginTop: '2rem',
              display: 'flex',
              gap: '1rem',
            }}
          >
            {user?.role !== 'EMPLOYEE' && (
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/admin/employees/edit/${employee.id}`)}
              >
                Edit Record
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => window.print()}>
              Print / Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};