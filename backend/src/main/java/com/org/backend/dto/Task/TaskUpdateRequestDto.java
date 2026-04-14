package com.org.backend.dto.Task;

import com.org.backend.enums.TaskPriority;
import com.org.backend.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record TaskUpdateRequestDto(
        @NotBlank(message="Task title: ")
                                  String title,
                                  String description,
                                  TaskPriority priority,
                                  TaskStatus status,
                                  LocalDate dueDate) {

}
