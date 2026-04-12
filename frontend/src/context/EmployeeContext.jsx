import React, { createContext, useContext, useState, useEffect } from 'react';

const EmployeeContext = createContext(undefined);

const initialEmployees = [
  {
    id: 'u1',
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@demo.com',
    phone: '555-0100',
    hireDate: '2023-01-01',
    departmentId: 'd1',
    designation: 'Administrator',
    status: 'Active',
    skills: ['System Design'],
  },
  {
    id: 'u2',
    firstName: 'Jane',
    lastName: 'Manager',
    email: 'manager@demo.com',
    phone: '555-0200',
    hireDate: '2023-06-15',
    departmentId: 'd1',
    designation: 'Engineering Manager',
    status: 'Active',
    skills: ['Leadership', 'Agile'],
  },
  {
    id: 'u3',
    firstName: 'John',
    lastName: 'Doe',
    email: 'employee@demo.com',
    phone: '555-0300',
    hireDate: '2024-02-10',
    departmentId: 'd2',
    managerId: 'u2',
    designation: 'Frontend Engineer',
    status: 'Active',
    skills: ['React', 'TypeScript'],
  },
];

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mock_employees');
    if (saved) {
      try {
        setEmployees(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('mock_employees');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mock_employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = async (emp) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setEmployees((prev) => [
      ...prev,
      { ...emp, id: Math.random().toString(36).substr(2, 9) },
    ]);
    setIsLoading(false);
  };

  const updateEmployee = async (id, updates) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    setIsLoading(false);
  };

  const deleteEmployee = async (id) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setIsLoading(false);
  };

  const getEmployeeById = (id) => employees.find((e) => e.id === id);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        isLoading,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};