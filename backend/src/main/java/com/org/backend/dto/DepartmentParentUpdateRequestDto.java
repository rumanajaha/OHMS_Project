package com.org.backend.dto;

import jakarta.validation.constraints.NotNull;

public record DepartmentParentUpdateRequestDto(

        @NotNull(message = "Enter valid parent department id")
        Long parentId

) {
}
