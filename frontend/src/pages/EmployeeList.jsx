import React, { useState, useMemo } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Edit2, Trash2, Eye, Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePositions } from '../context/PositionContext';

export const EmployeeList = () => {
  const { employees, isLoading, deleteEmployee } = useEmployees();
  const { departments } = useDepartments();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getDepartmentName = (id) => departments.find((d) => d.id === id)?.name || 'Unknown';
  const getManagerName = (id) => {
    if (!id) return '-';
    const mgr = employees.find((e) => e.id === id);
    return mgr ? `${mgr.firstName} ${mgr.lastName}` : 'Unknown';
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      const matchesDept = departmentFilter === 'All' || emp.departmentId === departmentFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [employees, searchTerm, statusFilter, departmentFilter]);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage));

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      await deleteEmployee(id);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="h1">Employee Directory</h1>
          <p className="text-muted">Manage your team members and their access.</p>
        </div>
        {(hasPermission('edit_team') || hasPermission('admin_all')) && (
          <button className="btn btn-primary" onClick={() => navigate('/admin/employees/new')}>
            <Plus size={16} /> Add Employee
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
       
        <div
          style={{
            padding: '1.5rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div
            className="search-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-main)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              flex: 1,
              minWidth: '200px',
            }}
          >
            <Search size={16} color="var(--text-light)" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '0.5rem', width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-input"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', width: 'auto' }}
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.4rem 0.75rem', width: 'auto' }}
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>


        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Info</th>
                <th>Department & Position </th>
                <th>Manager</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j}>
                        <div style={{ height: '20px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s infinite' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                      <p>No employees found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="animate-fade-in">
                    <td className="text-muted text-sm">{emp.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                          }}
                        >
                          {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem' }}>{emp.employeeCode}</div>
                          <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-xs text-muted">{emp.email} • {emp.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{getDepartmentName(emp.departmentId)}</div>
                      <div className="text-xs text-muted">{`${emp.position?.title}(${emp.position?.positionCode})` || "No position assigned"}</div>
                    </td>
                    <td className="text-sm">{getManagerName(emp.managerId)}</td>
                    <td>
                      <span
                        className={`badge badge-${emp.status === 'ACTIVE' ? 'success' : emp.status === 'On Leave' ? 'warning' : 'danger'}`}
                      >
                        {emp.status || 'N/A'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button className="btn btn-ghost" style={{ padding: '0.25rem' }} title="View" onClick={() => navigate(`/admin/employees/view/${emp.id}`)}>
                          <Eye size={18} />
                        </button>
                        <button className="btn btn-ghost" style={{ padding: '0.25rem' }} title="Edit" onClick={() => navigate(`/admin/employees/edit/${emp.id}`)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn btn-ghost text-danger" style={{ padding: '0.25rem' }} title="Delete" onClick={() => handleDelete(emp.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        {!isLoading && filteredEmployees.length > 0 && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="text-sm text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of{' '}
              {filteredEmployees.length} results
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.75rem' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.75rem' }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};