import { apiClient } from "./client"

const PREFIX = "/employees";

export const getEmployeesApi = ()=>{
    return apiClient(`${PREFIX}`);
}

export const createEmployeeApi = (employeeData) => {
    return apiClient(PREFIX, {
        method: "POST",
        body: JSON.stringify(employeeData),
    });
}

export const updateEmployeeApi = (employeeId, employeeData) => {
    return apiClient(`${PREFIX}/${employeeId}`, {
        method: "PUT",
        body: JSON.stringify(employeeData),
    });
}

export const deleteEmployeeApi = (employeeId) => {
    return apiClient(`${PREFIX}/${employeeId}`, {
        method: "DELETE",
    });
}

export const updateEmployeeStatusApi = (employeeId, status) => {
    return apiClient(`${PREFIX}/${employeeId}/status?status=${status}`, {
        method: "PATCH",
    });
}

export const searchEmployeesApi = (params) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`${PREFIX}/search?${query}`);
}
