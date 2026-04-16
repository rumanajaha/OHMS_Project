import { apiClient } from "./client";

const PREFIX = "/positions";

export const getPositionsApi = () => {
  return apiClient(PREFIX);
};

export const getPositionByIdApi = (positionId) => {
  return apiClient(`${PREFIX}/${positionId}`);
};

export const createPositionApi = (positionData) => {
  return apiClient(PREFIX, {
    method: "POST",
    body: JSON.stringify(positionData),
  });
};

export const updatePositionApi = (positionId, positionData) => {
  return apiClient(`${PREFIX}/${positionId}`, {
    method: "PUT",
    body: JSON.stringify(positionData),
  });
};

export const deletePositionApi = (positionId) => {
  return apiClient(`${PREFIX}/${positionId}`, {
    method: "DELETE",
  });
};
