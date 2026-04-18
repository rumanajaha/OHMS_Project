package com.org.backend.dto;

import com.org.backend.enums.EmployeeStatus;

import java.time.LocalDate;

public record EmployeeDto(
        Long id,
        String employeeCode,
        String firstName,
        String lastName,
        String fullName,
        String email,
        String phone,
        LocalDate hireDate,
        Long positionId,
        Long departmentId,
        Long managerId,
        EmployeeStatus status,
        String role,
        String skills,
        String profilePictureBase64,
        String resumeBase64,
        String resumeName
) {}