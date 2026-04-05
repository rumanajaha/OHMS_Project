package com.org.backend.dto;

public record LoginResponseDto(
        boolean success,
        String message,
        String token,
        CurrentUserDto user
) {
}
