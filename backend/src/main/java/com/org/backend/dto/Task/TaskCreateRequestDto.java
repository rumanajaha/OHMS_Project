package com.org.backend.dto.Task;

import com.org.backend.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
public record TaskCreateRequestDto(
        @NotBlank(message = "Task title: ")
        String title,
        String description,
        TaskPriority priority,
        LocalDate dueDate,
        @NotNull(message = "Assigned by employee ID: ")
        Long assignedByEmployeeId,
        List<Long> assigneeIds
) {}