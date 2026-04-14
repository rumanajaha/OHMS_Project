package com.org.backend.dto.Task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TaskCommentCreateRequestDto(

        @NotBlank(message = "Comment content is required")
        String content,

        @NotNull(message = "Employee ID is required")
        Long employeeId
) {}