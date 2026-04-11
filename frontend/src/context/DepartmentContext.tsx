import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Department {
  id: string;
  name: string;
  code: string;
  headEmployeeId?: string;
  parentDepartmentId?: string;
  createdAt: string;
}

interface DepartmentContextType {
  departments: Department[];
  isLoading: boolean;
  addDepartment: (dept: Omit<Department, 'id' | 'createdAt'>) => Promise<void>;
  updateDepartment: (id: string, dept: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  getDepartmentById: (id: string) => Department | undefined;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

const initialDepartments: Department[] = [
  { id: 'd1', name: 'Engineering', code: 'ENG', createdAt: new Date().toISOString() },
  { id: 'd2', name: 'Frontend', code: 'ENG-FE', parentDepartmentId: 'd1', createdAt: new Date().toISOString() },
  { id: 'd3', name: 'Human Resources', code: 'HR', createdAt: new Date().toISOString() },
];

export const DepartmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [isLoading, setIsLoading] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('mock_departments');
    if (saved) {
      try { setDepartments(JSON.parse(saved)); } catch (e) { localStorage.removeItem('mock_departments'); }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('mock_departments', JSON.stringify(departments));
  }, [departments]);

  const addDepartment = async (dept: Omit<Department, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500)); // simulate delay
    const newDept: Department = {
      ...dept,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setDepartments((prev) => [...prev, newDept]);
    setIsLoading(false);
  };

  const updateDepartment = async (id: string, updates: Partial<Department>) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    setIsLoading(false);
  };

  const deleteDepartment = async (id: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    setIsLoading(false);
  };

  const getDepartmentById = (id: string) => departments.find((d) => d.id === id);

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        isLoading,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        getDepartmentById,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartments = () => {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartments must be used within a DepartmentProvider');
  }
  return context;
};
