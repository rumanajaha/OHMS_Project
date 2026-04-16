package com.org.backend.dto;
import com.org.backend.enums.UserRoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;
public record EmployeeCreateRequestDto(
        @NotBlank(message = "Enter Employee code")
        String employeeCode,
        @NotBlank(message = "Enter First name")
        String firstName,
        @NotBlank(message = "Enter Last name ")
        String lastName,
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,
        String phone,
        @NotNull(message = "Hire date ")
        LocalDate hireDate,
        @NotNull(message = "Position ID is required")
        Long positionId,
        @NotNull(message = "Department ID is required")
        Long departmentId,
        Long managerId,

        @NotNull(message = "UserRole is required")
        UserRoleType role
) {
}