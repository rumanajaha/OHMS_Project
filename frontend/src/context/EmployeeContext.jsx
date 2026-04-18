import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createEmployeeApi,
  deleteEmployeeApi,
  getEmployeesApi,
  updateEmployeeApi,
  updateEmployeeStatusApi,
} from '../api/employee';
import { useAuth } from './AuthContext';
import { logActivity } from '../utils/activity';

const EmployeeContext = createContext(undefined);

export const EmployeeProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  

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
      logActivity(
        'Employee Created',
        `Added ${employeeData.firstName} ${employeeData.lastName} (${employeeData.employeeCode})`,
        'success'
      );
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
      logActivity(
        'Employee Updated',
        `Updated profile for ${employeeData.firstName} ${employeeData.lastName}`,
        'info'
      );
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
      logActivity(
        'Status Changed',
        `Employee status changed to ${status}`,
        'warning'
      );
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
      logActivity('Employee Removed', 'An employee was deleted from the system.', 'danger');
    }catch(err){
      window.alert(err.message || 'Failed to delete employee');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeById = (id) => employees.find((employee) => String(employee.id) === String(id));

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
