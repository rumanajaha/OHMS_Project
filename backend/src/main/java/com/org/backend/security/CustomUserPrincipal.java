package com.org.backend.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class CustomUserPrincipal {

    private Long userId;
    private String role;
    private Long employeeId;

}