package com.org.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PositionCreateRequestDto(
        @NotBlank(message = "Enter valid title")
        String title,

        @NotBlank(message = "Enter valid position code")
        String code,

        @NotNull(message = "Enter valid department id")
        Long departmentId,

        Long parentPositionId
) {
}
