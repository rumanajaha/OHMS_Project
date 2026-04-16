package com.org.backend.dto;

public record DepartmentDto(
        Long id,
        String name,
        String code,
        Long parentDepartmentId,
        EmployeeDto head
) {
}
