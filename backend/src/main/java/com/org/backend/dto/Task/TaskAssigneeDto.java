package com.org.backend.dto.Task;

public record TaskAssigneeDto(
        Long employeeId,
        String employeeName
) {
}
