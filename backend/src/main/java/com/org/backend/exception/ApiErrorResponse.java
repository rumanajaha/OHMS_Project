package com.org.backend.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiErrorResponse(
        int status,
        String errorCode,
        String message,
        Map<String, String> fieldErrors
) {
}
