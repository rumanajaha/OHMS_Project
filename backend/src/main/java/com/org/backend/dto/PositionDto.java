package com.org.backend.dto;

public record PositionDto(
        Long id,
        String titile,
        String positionCode,
        Long departmentId,
        Long parentPositionId
) {
}
