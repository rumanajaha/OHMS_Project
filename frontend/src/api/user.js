import { apiClient } from "./client";

const PREFIX = "/users";

export const changePasswordApi = (data) => {
  return apiClient(`${PREFIX}/me/password`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const resetEmployeePasswordApi = (employeeId) => {
  return apiClient(`${PREFIX}/employee/${employeeId}/reset-password`, {
    method: "PATCH",
  });
};
