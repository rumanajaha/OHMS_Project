-- -- ROLES
-- INSERT INTO roles (id, name, description) VALUES
-- (1, 'ADMIN', 'Full system access'),
-- (2, 'MANAGER', 'Team management'),
-- (3, 'EMPLOYEE', 'Basic access');
--
-- -- BASIC DATA
-- DEPARTMENTS
INSERT INTO departments (id, name, department_code) VALUES
(1, 'Administration', 'ADM');

-- POSITIONS
INSERT INTO positions (id, title, department_id, position_code) VALUES
(1, 'Admin', 1, 'ADM');

-- EMPLOYEES
INSERT INTO employees (id, employee_code, first_name, email, position_id, status) VALUES
(1, 'ADM001', 'Test', 'admin@gmail.com', 1, 'ACTIVE');