import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={name}>
            {index > 0 && <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>/</span>}
            {isLast ? (
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)', fontFamily: 'Poppins, sans-serif' }}>
                {formattedName === 'Dashboard' ? 'Overview' : formattedName}
              </span>
            ) : (
              <Link to={routeTo} style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
