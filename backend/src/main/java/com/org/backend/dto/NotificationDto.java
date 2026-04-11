package com.org.backend.dto;

public record NotificationDto(
        Long id,
        String title,
        String message,
        String type,
        Long refId,
        boolean isRead
) {
}
