package com.org.backend.dto;

import java.util.Set;

public record CurrentUserDto(
        Long userId,
        String role,
        Long employeeId,
        String username,
        String fullName,
        String email,
        String designation,
        String departmentName
) {
}
