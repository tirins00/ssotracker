package com.ssotracker.dto;

import com.ssotracker.model.Notification;
import com.ssotracker.model.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long notificationId,
        String message,
        NotificationType notificationType,
        LocalDateTime dateSent,
        Long requestId
) {
    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getNotificationId(),
                notification.getMessage(),
                notification.getNotificationType(),
                notification.getDateSent(),
                notification.getDocumentRequest().getRequestId()
        );
    }
}
