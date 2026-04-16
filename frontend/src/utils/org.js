export const ROLE_HOME_PATHS = {
  ADMIN: '/admin/dashboard',
  MANAGER: '/manager/dashboard',
  EMPLOYEE: '/employee/dashboard',
};

export const ROLE_BASE_PATHS = {
  ADMIN: '/admin',
  MANAGER: '/manager',
  EMPLOYEE: '/employee',
};

export const EMPLOYEE_STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ON_LEAVE: 'On Leave',
  TERMINATED: 'Terminated',
};

export const getRoleHomePath = (role) => ROLE_HOME_PATHS[role] || '/login';

export const getRoleBasePath = (role) => ROLE_BASE_PATHS[role] || '';

export const getEmployeeFullName = (employee) => {
  if (!employee) return 'Unknown';
  return employee.fullName || `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
};

export const getEmployeeStatusLabel = (status) => EMPLOYEE_STATUS_LABELS[status] || status || 'Unknown';

export const getEmployeeStatusBadge = (status) => {
  if (status === 'ACTIVE') return 'success';
  if (status === 'ON_LEAVE') return 'warning';
  if (status === 'TERMINATED') return 'danger';
  return 'neutral';
};

export const getDepartmentNameById = (departments, departmentId) =>
  departments.find((department) => department.id == departmentId)?.name || 'Unknown';

export const getPositionTitleById = (positions, positionId) =>
  positions.find((position) => position.id == positionId)?.title || 'Unassigned';

export const isManagerialPosition = (title) => {
  const normalizedTitle = (title || '').toLowerCase();
  return normalizedTitle.includes('manager') || normalizedTitle.includes('lead') || normalizedTitle.includes('director');
};