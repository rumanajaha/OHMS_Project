import { apiClient } from "./client";

const PREFIX = "/hierarchy";

export const getHierarchyTreeApi = () => {
  return apiClient(PREFIX);
};

export const movePositionApi = (positionId, parentId) => {
  return apiClient(`${PREFIX}/position/${positionId}/parent/${parentId}`, {
    method: "PATCH",
  });
};

export const assignEmployeeToPositionApi = (positionId, employeeId) => {
  return apiClient(`${PREFIX}/position/${positionId}/assign/${employeeId}`, {
    method: "PATCH",
  });
};

export const unassignEmployeeFromPositionApi = (positionId) => {
  return apiClient(`${PREFIX}/position/${positionId}/unassign`, {
    method: "PATCH",
  });
};
