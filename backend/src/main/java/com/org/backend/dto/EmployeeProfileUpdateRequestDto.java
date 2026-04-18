package com.org.backend.dto;

public record EmployeeProfileUpdateRequestDto(
    String skills,
    String profilePictureBase64,
    String resumeBase64,
    String resumeName
) {}
