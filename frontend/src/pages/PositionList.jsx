import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Edit2, Filter, Plus, Trash2 } from 'lucide-react';
import { usePositions } from '../context/PositionContext';
import { useDepartments } from '../context/DepartmentContext';
import { getDepartmentNameById, getEmployeeByPositionId, getEmployeeFullName, getPositionTitleById } from '../utils/org';
import { useEmployees } from '../context/EmployeeContext';

export const PositionList = () => {
  const navigate = useNavigate();
  const { positions, isLoading, deletePosition } = usePositions();
  const { departments } = useDepartments();
  const { employees } = useEmployees();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const filteredPositions = useMemo(() => {
    return positions.filter((position) => {
      const matchesSearch =
        position.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.positionCode?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        departmentFilter === 'All' || String(position.departmentId) === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [positions, searchTerm, departmentFilter]);

  const getEmployeeAssignedDetails = (posId)=>{
    const employee = getEmployeeByPositionId(employees, posId);
    return employee ? `${employee.employeeCode} - ${getEmployeeFullName(employee)}` : 'No employee assigned';
  }

  const handleDelete = async (positionId) => {
    if (window.confirm('Delete this position? Employees assigned to it may be affected.')) {
      await deletePosition(positionId);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="h1">Positions</h1>
          <p className="text-muted">Manage the roles employees can be assigned to.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/positions/new')}>
          <Plus size={16} /> Add Position
        </button>
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
          <input
            className="form-input"
            style={{ flex: 1, minWidth: '220px' }}
            placeholder="Search by title or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-input"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="All">All Departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Department</th>
                <th>Parent Position</th>
                <th>Employee assined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    <span className="spinner" style={{ width: '24px', height: '24px', color: 'var(--primary)' }} />
                  </td>
                </tr>
              ) : filteredPositions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <Briefcase size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <div>No positions found.</div>
                  </td>
                </tr>
              ) : (
                filteredPositions.map((position) => (
                  <tr key={position.id}>
                    <td className="text-sm text-muted">{position.positionCode || '-'}</td>
                    <td style={{ fontWeight: 500 }}>{position.title}</td>
                    <td>{getDepartmentNameById(departments, position.departmentId)}</td>
                    <td>{getPositionTitleById(positions, position.parentPositionId)}</td>
                    <td>{getEmployeeAssignedDetails(position.id)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '0.25rem' }}
                          title="Edit"
                          onClick={() => navigate(`/admin/positions/edit/${position.id}`)}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="btn btn-ghost text-danger"
                          style={{ padding: '0.25rem' }}
                          title="Delete"
                          onClick={() => handleDelete(position.id)}
                        >
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
      </div>
    </div>
  );
};
