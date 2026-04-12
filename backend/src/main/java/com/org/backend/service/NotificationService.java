package com.org.backend.service;

import com.org.backend.dto.NotificationDto;
import com.org.backend.entity.Notification;
import com.org.backend.enums.NotificationType;
import com.org.backend.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Not;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void notify(Long userId, String title, String message, NotificationType type, Long refId, Long createdUserId){

        Notification notification = new Notification();

        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(refId);
        notification.setCreatedUserId(createdUserId);

        notificationRepository.save(notification);
    }

    public List<NotificationDto> getAllNotifications(Long userId){

        List<Notification> notifications = notificationRepository.findByUserId(userId);

        return notifications.stream()
                .map(this::mapToDto).toList();
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId){

        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid notification id"));

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    private NotificationDto mapToDto(Notification notification){
        return new NotificationDto(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType().name(),
                notification.getReferenceId(),
                notification.getIsRead()
        );
    }
}
