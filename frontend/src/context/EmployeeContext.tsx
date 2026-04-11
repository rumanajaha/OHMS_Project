import React, { createContext, useContext, useState, useEffect } from 'react';

export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  departmentId: string;
  managerId?: string;
  designation: string;
  status: EmployeeStatus;
  skills: string[];
}

interface EmployeeContextType {
  employees: Employee[];
  isLoading: boolean;
  addEmployee: (emp: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, emp: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployeeById: (id: string) => Employee | undefined;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const initialEmployees: Employee[] = [
  {
    id: 'u1', // Admin
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
    id: 'u2', // Manager
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
    id: 'u3', // Employee
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

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mock_employees');
    if (saved) {
      try { setEmployees(JSON.parse(saved)); } catch (e) { localStorage.removeItem('mock_employees'); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mock_employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = async (emp: Omit<Employee, 'id'>) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    const newEmp: Employee = {
      ...emp,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEmployees((prev) => [...prev, newEmp]);
    setIsLoading(false);
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    setIsLoading(false);
  };

  const deleteEmployee = async (id: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setIsLoading(false);
  };

  const getEmployeeById = (id: string) => employees.find((e) => e.id === id);

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
