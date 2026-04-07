package com.org.backend.dto;

public record PositionDto(
        Long id,
        String titile,
        Long departmentId,
        Long parentPositionId
) {
}
