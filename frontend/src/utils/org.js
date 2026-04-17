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

export const normalizeId = (value) => {
  if (value === undefined || value === null || value === '') return null;
  return String(value);
};

export const getDepartmentNameById = (departments, departmentId) =>
  departments.find((department) => normalizeId(department.id) === normalizeId(departmentId))?.name || 'Unknown';

export const getPositionTitleById = (positions, positionId) =>
  positions.find((position) => normalizeId(position.id) === normalizeId(positionId))?.title || 'Unassigned';

export const getPositionById = (positions, positionId) =>
  positions.find((position) => normalizeId(position.id) === normalizeId(positionId)) || null;

export const getEmployeeById = (employees, employeeId) =>
  employees.find((employee) => normalizeId(employee.id) === normalizeId(employeeId)) || null;

export const getEmployeeByPositionId = (employees, positionId) =>
  employees.find((employee) => normalizeId(employee.positionId) === normalizeId(positionId)) || null;

export const getPositionChildren = (positions, parentPositionId) =>
  positions.filter((position) => normalizeId(position.parentPositionId) === normalizeId(parentPositionId));

export const getPositionParent = (positions, positionId) => {
  const position = getPositionById(positions, positionId);
  return position ? getPositionById(positions, position.parentPositionId) : null;
};

export const getEffectiveManager = (employee, employees, positions) => {
  if (!employee?.positionId) return null;
  const parentPosition = getPositionParent(positions, employee.positionId);
  if (!parentPosition) return null;
  return getEmployeeByPositionId(employees, parentPosition.id);
};

export const getDirectReports = (managerEmployee, employees, positions) => {
  if (!managerEmployee?.positionId) return [];
  const childPositions = getPositionChildren(positions, managerEmployee.positionId);
  return childPositions
    .map((position) => getEmployeeByPositionId(employees, position.id))
    .filter(Boolean);
};

export const getPeersForEmployee = (employee, employees, positions) => {
  const manager = getEffectiveManager(employee, employees, positions);
  if (!manager) return [];
  return getDirectReports(manager, employees, positions)
    .filter((member) => normalizeId(member.id) !== normalizeId(employee.id));
};

export const getRootPositions = (positions) =>
  positions.filter((position) => !normalizeId(position.parentPositionId));

export const getNotificationMeta = (type) => {
  switch ((type || '').toUpperCase()) {
    case 'TASK_ASSIGNED':
      return { tone: 'warning', label: 'Task update' };
    case 'POSITION_CHANGED':
      return { tone: 'success', label: 'Position update' };
    case 'DEPARTMENT_CHANGED':
      return { tone: 'success', label: 'Department update' };
    case 'MANAGER_CHANGED':
      return { tone: 'warning', label: 'Reporting update' };
    case 'EMPLOYEE_ASSIGNED':
      return { tone: 'success', label: 'Assignment update' };
    default:
      return { tone: 'neutral', label: 'Notification' };
  }
};

export const isManagerialPosition = (title) => {
  const normalizedTitle = (title || '').toLowerCase();
  return normalizedTitle.includes('manager') || normalizedTitle.includes('lead') || normalizedTitle.includes('director');
};
