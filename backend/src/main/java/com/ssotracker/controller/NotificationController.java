package com.ssotracker.controller;

import com.ssotracker.dto.NotificationResponse;
import com.ssotracker.repository.NotificationRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    List<NotificationResponse> findAll() {
        return notificationRepository.findAll().stream()
                .sorted((left, right) -> right.getDateSent().compareTo(left.getDateSent()))
                .map(NotificationResponse::from)
                .toList();
    }
}
