package com.org.backend.dto;

public record PositionUpdateRequestDto(
        String title,
        Long departmentId,
        Long parentPositionId
) {
}
