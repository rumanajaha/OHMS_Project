import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext(undefined);

import { getTasks as apiGetTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask, assignEmployees as apiAssignEmployees } from '../api/task';
import { logActivity } from '../utils/activity';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await apiGetTasks();
      const formatted = data.map(t => ({
        ...t,
        assignee: t.assignees && t.assignees.length > 0 ? t.assignees[0].employeeName : 'Unassigned',
      }));
      setTasks(formatted);
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task) => {
    setIsLoading(true);
    try {
      await apiCreateTask(task);
      logActivity('Task Created', `Task "${task.title}" was created successfully.`, 'success');
      await fetchTasks();
    } catch (e) {
      console.error('Failed to create task:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id, updates) => {
    setIsLoading(true);
    try {
      await apiUpdateTask(id, updates);
      logActivity('Task Updated', `Task "${updates.title || id}" was updated.`, 'info');
      await fetchTasks();
    } catch (e) {
      console.error('Failed to update task:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setIsLoading(true);
    try {
      await apiDeleteTask(id);
      logActivity('Task Deleted', `A task was permanently deleted.`, 'danger');
      await fetchTasks();
    } catch (e) {
      console.error('Failed to delete task:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const assignTask = async (id, assigneeIds) => {
    setIsLoading(true);
    try {
      await apiAssignEmployees(id, { assigneeIds });
      logActivity('Task Assigned', `Task ${id} has been newly assigned to members.`, 'info');
      await fetchTasks();
    } catch (e) {
      console.error('Failed to assign task:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskById = (id) => tasks.find((t) => t.id === Number(id) || String(t.id) === String(id));

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, addTask, updateTask, deleteTask, assignTask, getTaskById, refreshTasks: fetchTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};