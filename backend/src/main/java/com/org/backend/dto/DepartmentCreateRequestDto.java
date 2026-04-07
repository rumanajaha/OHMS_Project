package com.org.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record DepartmentCreateRequestDto(

        @NotBlank(message = "Enter valid department name")
        String name,

        @NotBlank(message = "Enter valid department code")
        String departmentCode,

        Long parentDepartmentId,
        Long headEmployeeId
) {
}
