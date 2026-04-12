package com.org.backend.controller;

import com.org.backend.dto.NotificationDto;
import com.org.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationDto> getAllNotifications(
            @AuthenticationPrincipal Long userId
    ){
        return notificationService.getAllNotifications(userId);
    }

    @PutMapping("{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAsRead(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id){
        notificationService.markAsRead(id, userId);
    }

}
