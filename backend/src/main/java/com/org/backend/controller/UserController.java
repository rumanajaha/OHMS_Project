package com.org.backend.controller;

import com.org.backend.dto.ChangePasswordRequestDto;
import com.org.backend.dto.CurrentUserDto;
import com.org.backend.security.CustomUserPrincipal;
import com.org.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
@PreAuthorize("isAuthenticated()")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public CurrentUserDto me(
            @AuthenticationPrincipal CustomUserPrincipal user
    ){
        return userService.me(user.getUserId());
    }

    @PatchMapping("/me/password")
    public void changePassword(
            @AuthenticationPrincipal CustomUserPrincipal user,
            @Valid @RequestBody ChangePasswordRequestDto request
    ) {
        userService.changePassword(user.getUserId(), request.oldPassword(), request.newPassword());
    }

    @PreAuthorize("hasAuthority('EMPLOYEE_UPDATE')")
    @PatchMapping("/employee/{employeeId}/reset-password")
    public void resetEmployeePassword(
            @PathVariable Long employeeId
    ) {
        userService.resetEmployeePassword(employeeId);
    }

}
