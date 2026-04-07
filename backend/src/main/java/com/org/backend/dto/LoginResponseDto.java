package com.org.backend.dto;

public record LoginResponseDto(
        int status,
        String message,
        String token,
        CurrentUserDto user
) {
}
