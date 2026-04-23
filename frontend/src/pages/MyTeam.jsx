import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmployees } from '../context/EmployeeContext';
import { usePositions } from '../context/PositionContext';
import { getEmployeeFullName, getEmployeeStatusBadge, getEmployeeStatusLabel, getPositionTitleById } from '../utils/org';
import { getMyTeamDynamicApi } from '../api/employee';

export const MyTeam = () => {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { positions } = usePositions();
  
  const [myTeam, setMyTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const managerData = employees.find((e) => String(e.id) === String(user?.employeeId));

  useEffect(() => {
    const fetchTeam = async () => {
      if (!user?.employeeId) return;
      setIsLoading(true);
      try {
        const teamData = await getMyTeamDynamicApi(user.employeeId);
        setMyTeam(teamData);
      } catch (err) {
        console.error('Failed to load dynamic team', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, [user]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="h1">My Team</h1>
        <p className="text-muted text-sm">Visualizing your structured team network.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', width: '100%', justifyContent: 'center' }}>
        <div style={{ flex: selectedEmployee ? '0 0 65%' : '1', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.3s' }}>
          
          {isLoading ? (
            <div style={{ padding: '2rem' }}>Loading team structure...</div>
          ) : (
            <>
       
        {managerData && (
          <div className="card" onClick={() => setSelectedEmployee(managerData)} style={{ width: '260px', textAlign: 'center', position: 'relative', zIndex: 10, borderTop: '4px solid var(--primary)', cursor: 'pointer' }}>
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
            <div key={member.id} className="card" onClick={() => setSelectedEmployee(member)} style={{ width: '220px', textAlign: 'center', borderTop: '4px solid var(--secondary)', cursor: 'pointer' }}>
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
            <p>You currently do not have any team members assigned.</p>
          </div>
        )}
        </>
        )}
        </div>

        {selectedEmployee && (
          <div className="card animate-fade-in" style={{ flex: '0 0 30%', position: 'sticky', top: '2rem', minWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600 }}>
                  {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{getEmployeeFullName(selectedEmployee)}</h3>
                  <p className="text-muted text-sm" style={{ margin: 0 }}>{getPositionTitleById(positions, selectedEmployee.positionId)}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEmployee(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }}
              >&times;</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p className="text-muted text-sm" style={{ marginBottom: '0.25rem' }}>Email</p>
                <p style={{ margin: 0, fontSize: '0.9375rem' }}>{selectedEmployee.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted text-sm" style={{ marginBottom: '0.25rem' }}>Phone</p>
                <p style={{ margin: 0, fontSize: '0.9375rem' }}>{selectedEmployee.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted text-sm" style={{ marginBottom: '0.25rem' }}>Employee ID</p>
                <p style={{ margin: 0, fontSize: '0.9375rem' }}>{selectedEmployee.employeeCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted text-sm" style={{ marginBottom: '0.625rem' }}>Status</p>
                <span className={`badge badge-${getEmployeeStatusBadge(selectedEmployee.status)} text-xs`}>{getEmployeeStatusLabel(selectedEmployee.status)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
