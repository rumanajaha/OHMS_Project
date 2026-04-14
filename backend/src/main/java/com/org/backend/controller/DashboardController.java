package com.org.backend.controller;

import com.org.backend.dto.dashboard.DashboardDto;
import com.org.backend.security.CustomUserPrincipal;
import com.org.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardDto getDashboardData(
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal
    ){
        return dashboardService.getDashboardData(userPrincipal);
    }
}
