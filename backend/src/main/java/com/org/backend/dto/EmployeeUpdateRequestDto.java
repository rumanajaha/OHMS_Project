package com.org.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
public record EmployeeUpdateRequestDto(
        @NotBlank(message = "Enter Employee code")
        String employeeCode,
        @NotBlank(message = "Enter First name")
        String firstName,
        @NotBlank(message = "Enter Last name")
        String lastName,
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,
        String phone,
        @NotNull(message = "Hire date is required")
        LocalDate hireDate,
        Long positionId,
        Long departmentId,
        Long managerId

) {}