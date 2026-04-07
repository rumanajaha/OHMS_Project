package com.org.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PositionCreateRequestDto(
        @NotBlank(message = "Enter valid title")
        String title,

        @NotNull(message = "Enter valid department id")
        Long departmentId,

        Long parentPositionId
) {
}
