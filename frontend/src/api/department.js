import {apiClient} from "./client";

const PREFIX = "/departments";

export const getDepartmentsApi = ()=>{
    return apiClient(PREFIX)
}

export const createDepartmentApi = (deptData)=>{
    return apiClient(PREFIX, {
        method: "POST",
        body: JSON.stringify(deptData)
    });
}

export const updateDepartmentApi = (depId, depData)=>{
    return apiClient(`${PREFIX}/${depId}`, {
        method: "PUT",
        body: JSON.stringify(depData)
    });
}

export const deleteDepartmentApi = (depId)=>{
    return apiClient(`${PREFIX}/${depId}`, {
        method: "DELETE"
    })
}