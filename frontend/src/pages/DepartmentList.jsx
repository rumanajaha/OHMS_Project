import React, { useState } from 'react';
import { useDepartments } from '../context/DepartmentContext';
import { useEmployees } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { Building2, Search, Plus, MoreHorizontal, Users, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DepartmentList = () => {
  const { departments, deleteDepartment } = useDepartments();
  const { employees } = useEmployees();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const getHeadName = (id) => {
    if (!id) return 'No Manager Assigned';
    const head = employees.find((e) => e.id === id);
    return head ? `${head.firstName} ${head.lastName}` : 'System Admin';
  };

  const getEmployeeCount = (deptId) => {
    return employees.filter((e) => e.departmentId === deptId).length;
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const detailDept = selectedDept ? departments.find((d) => d.id === selectedDept) : null;
  const deptMembers = detailDept ? employees.filter((e) => e.departmentId === detailDept.id) : [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="h1">Departments</h1>
            <p className="text-muted text-sm">Organize and manage your company departments.</p>
          </div>
          {hasPermission('admin_all') && (
            <button className="btn btn-primary" onClick={() => navigate('/admin/departments/new')}>
              <Plus size={16} /> Add Department
            </button>
          )}
        </div>

        <div
          className="search-bar"
          style={{
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            maxWidth: '400px',
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              marginLeft: '0.75rem',
              width: '100%',
              fontSize: '0.875rem',
            }}
          />
        </div>

        <div
          className="grid-cards"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', paddingBottom: '2rem' }}
        >
          {filteredDepartments.map((dept) => (
            <div
              key={dept.id}
              className="card"
              style={{
                cursor: 'pointer',
                border: selectedDept === dept.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                padding: '1.5rem',
                position: 'relative',
              }}
              onClick={() => {
                setSelectedDept(dept.id);
                setDropdownOpen(null);
              }}
            >
              <button
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(dropdownOpen === dept.id ? null : dept.id);
                }}
              >
                <MoreHorizontal size={18} />
              </button>

              {dropdownOpen === dept.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: '2.5rem',
                    right: '1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 20,
                    minWidth: '140px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      color: 'var(--text-main)',
                      fontSize: '0.875rem',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/departments/edit/${dept.id}`);
                    }}
                  >
                    Edit Department
                  </button>
                  <button
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--danger)',
                      fontSize: '0.875rem',
                    }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this department?')) {
                        await deleteDepartment(dept.id);
                      }
                      setDropdownOpen(null);
                    }}
                  >
                    Delete Department
                  </button>
                </div>
              )}

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--bg-main)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Building2 size={24} />
              </div>

              <h3 className="h3" style={{ marginBottom: '0.25rem' }}>{dept.name}</h3>
              <p className="text-sm text-muted" style={{ marginBottom: '1.25rem' }}>Code: {dept.code}</p>

              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p className="text-xs text-muted">Head</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>
                    {getHeadName(dept.headEmployeeId)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="text-xs text-muted">Members</p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      justifyContent: 'flex-end',
                      color: 'var(--text-main)',
                    }}
                  >
                    <Users size={14} className="text-muted" />
                    <span className="text-sm font-medium">{getEmployeeCount(dept.id)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

   
      {selectedDept && detailDept && (
        <div
          style={{
            width: '360px',
            marginLeft: '2rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 className="h2" style={{ marginBottom: '0.25rem' }}>{detailDept.name}</h3>
            {/* <span className="badge badge-neutral text-xs">
              Created: {new Date(detailDept.createdAt).toLocaleDateString()}
            </span> */}
          </div>

          <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
            <h4
              className="text-sm text-muted"
              style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}
            >
              Department Analytics
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <p className="text-xs text-muted mb-1">Total Members</p>
                <p className="h2">{deptMembers.length}</p>
              </div>
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <p className="text-xs text-muted mb-1">Sub-Departments</p>
                <p className="h2">0</p>
              </div>
            </div>

            <h4
              className="text-sm text-muted"
              style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}
            >
              Team Members
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {deptMembers.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--bg-subtle)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  >
                    {member.firstName.charAt(0)}
                    {member.lastName.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-muted">{member.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '1rem',
            }}
          >
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => navigate(`/admin/departments/edit/${detailDept.id}`)}
            >
              Edit Record
            </button>
            <button
              className="btn btn-ghost text-danger"
              style={{ padding: '0.5rem' }}
              onClick={async () => {
                if (window.confirm('Delete this department?')) {
                  await deleteDepartment(detailDept.id);
                  setSelectedDept(null);
                }
              }}
            >
              <ShieldAlert size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};