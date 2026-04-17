import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmployees } from '../context/EmployeeContext';
import { usePositions } from '../context/PositionContext';
import { getDirectReports, getEmployeeFullName, getEmployeeStatusBadge, getEmployeeStatusLabel, getPositionTitleById } from '../utils/org';

export const MyTeam = () => {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { positions } = usePositions();

  const managerData = employees.find((e) => e.id === user?.employeeId);
  const myTeam = getDirectReports(managerData, employees, positions);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="h1">My Team</h1>
        <p className="text-muted text-sm">Visualizing your direct reports.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
       
        {managerData && (
          <div className="card" style={{ width: '260px', textAlign: 'center', position: 'relative', zIndex: 10, borderTop: '4px solid var(--primary)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 600, margin: '0 auto 1rem' }}>
              {managerData.firstName.charAt(0)}{managerData.lastName.charAt(0)}
            </div>
            <h3 className="h3" style={{ marginBottom: '0.25rem' }}>{getEmployeeFullName(managerData)}</h3>
            <p className="text-sm text-muted">{getPositionTitleById(positions, managerData.positionId)}</p>
          </div>
        )}

        {myTeam.length > 0 && (
          <div style={{ width: '2px', height: '40px', background: 'var(--border-color)', margin: '0 auto' }} />
        )}

        {myTeam.length > 1 && (
          <div style={{ width: `calc(100% - ${100 / myTeam.length}%)`, height: '2px', background: 'var(--border-color)', position: 'relative' }}>
            {myTeam.map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `${(100 / (myTeam.length - 1)) * i}%`,
                  width: '2px',
                  height: '20px',
                  background: 'var(--border-color)',
                }}
              />
            ))}
          </div>
        )}

        {myTeam.length === 1 && (
          <div style={{ width: '2px', height: '20px', background: 'var(--border-color)', margin: '0 auto' }} />
        )}

      
        <div style={{ display: 'flex', gap: '2rem', marginTop: myTeam.length > 1 ? '20px' : '0' }}>
          {myTeam.map((member) => (
            <div key={member.id} className="card" style={{ width: '220px', textAlign: 'center', borderTop: '4px solid var(--secondary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--bg-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600, margin: '0 auto 1rem' }}>
                {member.firstName.charAt(0)}{member.lastName.charAt(0)}
              </div>
              <h4 style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)', marginBottom: '0.25rem', fontFamily: 'Poppins, sans-serif' }}>
                {getEmployeeFullName(member)}
              </h4>
              <p className="text-xs text-muted mb-2">{getPositionTitleById(positions, member.positionId)}</p>
              <span className={`badge badge-${getEmployeeStatusBadge(member.status)} text-xs`}>{getEmployeeStatusLabel(member.status)}</span>
            </div>
          ))}
        </div>

        {myTeam.length === 0 && (
          <div style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
            <p>You have no direct reports.</p>
          </div>
        )}
      </div>
    </div>
  );
};
