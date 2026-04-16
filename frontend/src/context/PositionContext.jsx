import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createPositionApi,
  deletePositionApi,
  getPositionsApi,
  updatePositionApi,
} from '../api/position';
import { useAuth } from './AuthContext';
import { useEmployees } from './EmployeeContext';

const PositionContext = createContext(undefined);

export const PositionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPositions = async () => {

    setIsLoading(true);
    try {
      const data = await getPositionsApi();
      setPositions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch positions', err);
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPositions();
    } else {
      setPositions([]);
    }
  }, [isAuthenticated]);

  const addPosition = async (positionData) => {
    setIsLoading(true);
    try {
      const newPosition = await createPositionApi(positionData);
      setPositions((prev) => [...prev, newPosition]);
      return newPosition;
    }catch(err){
      window.alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePosition = async (id, positionData) => {
    setIsLoading(true);
    try {
      const updatedPosition = await updatePositionApi(id, positionData);
      setPositions((prev) => prev.map((position) => (position.id == id ? updatedPosition : position)));
      return updatedPosition;
    }catch(err){
      window.alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePosition = async (id) => {
    setIsLoading(true);
    try {
      await deletePositionApi(id);
      setPositions((prev) => prev.filter((position) => position.id != id));
    }catch(err){
      window.alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionById = (id) => positions.find((position) => position.id == id);

  return (
    <PositionContext.Provider
      value={{
        positions,
        isLoading,
        fetchPositions,
        addPosition,
        updatePosition,
        deletePosition,
        getPositionById,
      }}
    >
      {children}
    </PositionContext.Provider>
  );
};

export const usePositions = () => {
  const context = useContext(PositionContext);
  if (context === undefined) {
    throw new Error('usePositions must be used within a PositionProvider');
  }
  return context;
};
