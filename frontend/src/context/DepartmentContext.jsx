import React, { createContext, useContext, useState, useEffect } from 'react';

const DepartmentContext = createContext(undefined);

const initialDepartments = [
  { id: 'd1', name: 'Engineering', code: 'ENG', createdAt: new Date().toISOString() },
  { id: 'd2', name: 'Frontend', code: 'ENG-FE', parentDepartmentId: 'd1', createdAt: new Date().toISOString() },
  { id: 'd3', name: 'Human Resources', code: 'HR', createdAt: new Date().toISOString() },
];

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mock_departments');
    if (saved) {
      try {
        setDepartments(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('mock_departments');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mock_departments', JSON.stringify(departments));
  }, [departments]);

  const addDepartment = async (dept) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setDepartments((prev) => [
      ...prev,
      {
        ...dept,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      },
    ]);
    setIsLoading(false);
  };

  const updateDepartment = async (id, updates) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    setIsLoading(false);
  };

  const deleteDepartment = async (id) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    setIsLoading(false);
  };

  const getDepartmentById = (id) => departments.find((d) => d.id === id);

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