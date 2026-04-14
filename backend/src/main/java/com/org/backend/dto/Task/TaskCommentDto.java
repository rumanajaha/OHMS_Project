package com.org.backend.dto.Task;

import java.time.LocalDateTime;

public record TaskCommentDto(
        Long id,
        String content,
        Long employeeId,
        String employeeName,
        LocalDateTime createdAt
) {}