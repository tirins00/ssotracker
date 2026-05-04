package com.ssotracker.repository;

import com.ssotracker.model.Notification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @EntityGraph(attributePaths = "documentRequest")
    List<Notification> findByDocumentRequestRequestIdOrderByDateSentDesc(Long requestId);
}
