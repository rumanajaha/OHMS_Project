import { apiClient } from './client';

export const getTasks = async () => {
  return await apiClient('/tasks');
};

export const getTaskById = async (id) => {
  return await apiClient(`/tasks/${id}`);
};

export const createTask = async (taskData) => {
  return await apiClient('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

export const updateTask = async (id, taskData) => {
  return await apiClient(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
};

export const deleteTask = async (id) => {
  return await apiClient(`/tasks/${id}`, {
    method: 'DELETE',
  });
};

export const assignEmployees = async (id, assignData) => {
  return await apiClient(`/tasks/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify(assignData),
  });
};
