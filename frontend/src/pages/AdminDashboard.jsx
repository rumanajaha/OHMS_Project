import React from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { useDepartments } from '../context/DepartmentContext';
import { Users, Building, Activity, CheckSquare, Network } from 'lucide-react';

export const AdminDashboard = () => {
  const { employees } = useEmployees();
  const { departments } = useDepartments();

  const managersCount = employees.filter(e =>
    e.designation.toLowerCase().includes('manager')
  ).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="h1">Overview</h1>
        <p className="text-muted text-sm">Welcome back to the administrative portal.</p>
      </div>

      
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Employees</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>{employees.length}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Departments</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={18} />
            </div>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>{departments.length}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Managers</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} />
            </div>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>{managersCount}</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Active Tasks</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={18} />
            </div>
          </div>
          <div className="h1" style={{ fontSize: '2rem' }}>24</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          <h2 className="h3" style={{ marginBottom: '1.5rem' }}>Organization Preview</h2>
          <div style={{ flex: 1, border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <div style={{ textAlign: 'center' }}>
              <Network size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
              <p className="text-sm">Interactive graph preview will render here.</p>
              <a href="/admin/hierarchy" style={{ fontSize: '0.875rem', marginTop: '0.5rem', display: 'inline-block' }}>
                Open Full Map &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Activity & Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h2 className="h3" style={{ marginBottom: '1.5rem' }}>Notifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginTop: '6px' }} />
                <div>
                  <p className="text-sm" style={{ fontWeight: 500, color: 'var(--text-main)' }}>Leave Request: Jane Doe</p>
                  <p className="text-xs text-muted">2 hours ago</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--border-color)', marginTop: '6px' }} />
                <div>
                  <p className="text-sm" style={{ fontWeight: 500, color: 'var(--text-main)' }}>System update scheduled</p>
                  <p className="text-xs text-muted">1 day ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <h2 className="h3" style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '1rem', marginLeft: '0.25rem' }}>
                <p className="text-sm" style={{ color: 'var(--text-main)' }}>
                  New department <strong>Design</strong> created.
                </p>
                <p className="text-xs text-muted">Just now</p>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '1rem', marginLeft: '0.25rem' }}>
                <p className="text-sm" style={{ color: 'var(--text-main)' }}>
                  Employee <strong>John Smith</strong> onboarded.
                </p>
                <p className="text-xs text-muted">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};