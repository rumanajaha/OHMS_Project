package com.org.backend.controller;

import com.org.backend.dto.CurrentUserDto;
import com.org.backend.security.CustomUserPrincipal;
import com.org.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
