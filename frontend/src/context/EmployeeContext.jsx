import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createEmployeeApi,
  deleteEmployeeApi,
  getEmployeesApi,
  updateEmployeeApi,
  updateEmployeeStatusApi,
} from '../api/employee';
import { useAuth } from './AuthContext';
import { usePositions } from './PositionContext';

const EmployeeContext = createContext(undefined);

export const EmployeeProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const {positions} = usePositions();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // console.log(positions);
  

  const fetchEmployees = async () => {
    
    setIsLoading(true);
    try {
      const data = await getEmployeesApi();
      setEmployees(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error('Failed to fetch employees', err);
      setEmployees([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{

    employees.map((emp) => {
      let position = positions.filter((pos) => emp.positionId == pos.id)?.[0]
      
      emp["position"] = position;
      return emp
    })
  },[employees]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmployees().catch(() => {});
    } else {
      setEmployees([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);
  

  const addEmployee = async (employeeData) => {
    setIsLoading(true);
    try {
      const createdEmployee = await createEmployeeApi(employeeData);
      setEmployees((prev) => [...prev, createdEmployee]);
      return createdEmployee;
    }catch(err){
      window.alert(err.message || 'Failed to create employee');

    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployee = async (id, employeeData) => {
    setIsLoading(true);
    try {
      const updatedEmployee = await updateEmployeeApi(id, employeeData);
      setEmployees((prev) => prev.map((employee) => (employee.id == id ? updatedEmployee : employee)));
      return updatedEmployee;
    }catch(err){
      window.alert(err.message || 'Failed to update employee');
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployeeStatus = async (id, status) => {
    setIsLoading(true);
    try {
      const updatedEmployee = await updateEmployeeStatusApi(id, status);
      setEmployees((prev) => prev.map((employee) => (employee.id == id ? updatedEmployee : employee)));
      return updatedEmployee;
    }catch(err){
      window.alert(err.message || 'Failed to update employee');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    setIsLoading(true);
    try {
      await deleteEmployeeApi(id);
      setEmployees((prev) => prev.filter((employee) => employee.id != id));
    }catch(err){
      window.alert(err.message || 'Failed to delete employee');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeById = (id) => employees.find((employee) => employee.id == id);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        isLoading,
        fetchEmployees,
        addEmployee,
        updateEmployee,
        updateEmployeeStatus,
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
