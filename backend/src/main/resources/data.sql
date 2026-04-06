-- ROLES
INSERT INTO roles (id, name, description) VALUES
(1, 'ADMIN', 'Full system access'),
(3, 'MANAGER', 'Team management'),
(4, 'EMPLOYEE', 'Basic access');

-- PERMISSIONS
INSERT INTO permissions (id, name) VALUES
(1, 'EMPLOYEE_VIEW_SELF'),
(2, 'EMPLOYEE_VIEW_TEAM'),
(3, 'EMPLOYEE_CREATE'),
(4, 'EMPLOYEE_UPDATE'),

(5, 'HIERARCHY_VIEW'),
(6, 'HIERARCHY_EDIT');

-- ADMIN ROLE PERMISSIONS (ALL)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- MANAGER ROLE PERMISSIONS
INSERT INTO role_permissions (role_id, permission_id) VALUES
(3, 2),
(3, 5);

-- EMPLOYEE ROLE PERMISSIONS
INSERT INTO role_permissions (role_id, permission_id) VALUES
(4, 1),
(4, 5);

-- BASIC DATA

-- DEPARTMENTS
INSERT INTO departments (id, name, department_code) VALUES
(1, 'Administration', 'ADM');

-- POSITIONS
INSERT INTO positions (id, title, department_id) VALUES
(1, 'Admin', 1);

-- EMPLOYEES
INSERT INTO employees (id, employee_code, first_name, email, position_id) VALUES
(1, 'ADM001', 'Test', 'admin@gmail.com', 1);