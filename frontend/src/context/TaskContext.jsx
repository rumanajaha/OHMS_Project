import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext(undefined);

const initialTasks = [
  {
    id: 't1',
    title: 'Update internal company policies document',
    description: 'Review and update the 2026 handbook.',
    assignee: 'You',
    dueDate: 'Apr 12',
    priority: 'Medium',
    status: 'To Do',
    progress: 0,
  },
  {
    id: 't2',
    title: 'Implement new onboarding workflow',
    description: 'Setup the new hire checklist inside the app.',
    assignee: 'John Smith',
    dueDate: 'Apr 10',
    priority: 'High',
    status: 'In Progress',
    progress: 50,
  },
  {
    id: 't3',
    title: 'March expense reports processing',
    description: 'Clear all pending HR approvals.',
    assignee: 'You',
    dueDate: 'Mar 31',
    priority: 'Medium',
    status: 'Completed',
    progress: 100,
  },
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mock_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('mock_tasks');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mock_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (task) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    setTasks((prev) => [
      ...prev,
      { ...task, id: Math.random().toString(36).substr(2, 9) },
    ]);
    setIsLoading(false);
  };

  const updateTask = async (id, updates) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    setIsLoading(false);
  };

  const deleteTask = async (id) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setIsLoading(false);
  };

  const getTaskById = (id) => tasks.find((t) => t.id === id);

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, addTask, updateTask, deleteTask, getTaskById }}
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