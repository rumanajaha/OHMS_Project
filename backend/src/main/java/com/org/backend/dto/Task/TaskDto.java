package com.org.backend.dto.Task;

import com.org.backend.enums.TaskPriority;
import com.org.backend.enums.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TaskDto(
        Long id,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        LocalDate dueDate,
        Long AssignedByEmployeeId,
        String AssignedByName,
        List<TaskAssigneeDto> assignees,
        LocalDateTime createdAt
) {
}
