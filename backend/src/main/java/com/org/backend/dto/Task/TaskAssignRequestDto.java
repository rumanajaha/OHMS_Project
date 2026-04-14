package com.org.backend.dto.Task;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TaskAssignRequestDto(
        @NotNull(message="Enter Assignee IDs")
        List<Long> assigneeIds
) {
}
