import React, { createContext, useContext, useState, useEffect } from 'react';
import { createDepartmentApi, deleteDepartmentApi, getDepartmentsApi, updateDepartmentApi } from '../api/department';
import { useAuth } from './AuthContext';

const DepartmentContext = createContext(undefined);


export const DepartmentProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDepartments = async ()=>{
    setIsLoading(true);

    try{
      const data = await getDepartmentsApi();
      setDepartments(data);
    }catch(err){
      console.error("Failed to fetch departments", err);
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDepartments();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);

  const addDepartment = async (dept) => {
    setIsLoading(true);

    try{
      const newDept = await createDepartmentApi(dept);
      setDepartments((prev) => [...prev, newDept]);
    }catch(err){
      window.alert(err);
      console.log("Failed to create Department", err);
    }finally{
      setIsLoading(false);
    }
  };

  const updateDepartment = async (id, updates) => {
    setIsLoading(true);
    try{
      const updatedDep = await updateDepartmentApi(id, updates);
      setDepartments((prev) =>
        prev.map((d) => (d.id == id ? { ...d, ...updates } : d))
      );
    }catch(err){
      window.alert(err);
      console.log("Failed to update Department", err);
    }finally{
      setIsLoading(false);
    }

  };

  const deleteDepartment = async (id) => {
    console.log("delete", id);
    setIsLoading(true);
    try{
      await deleteDepartmentApi(id);
      setDepartments((prev) => prev.filter((d) => d.id != id));
    }catch(err){
      window.alert(err);
      console.log("Failed to delete Department", err);
    }finally{
      setIsLoading(false);
    }
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