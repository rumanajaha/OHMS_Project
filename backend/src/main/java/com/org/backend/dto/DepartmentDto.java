package com.org.backend.dto;

public record DepartmentDto(
        Long id,
        String name,
        String departmentCode,
        Long parentDepartmentId,
        EmployeeDto head
) {
}
