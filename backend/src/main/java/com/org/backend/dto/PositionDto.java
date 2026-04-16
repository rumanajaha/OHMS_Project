package com.org.backend.dto;

public record PositionDto(
        Long id,
        String title,
        String positionCode,
        Long departmentId,
        Long parentPositionId
) {
}
