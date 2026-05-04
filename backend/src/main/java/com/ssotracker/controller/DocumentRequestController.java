package com.ssotracker.controller;

import com.ssotracker.dto.DocumentRequestCreateRequest;
import com.ssotracker.dto.DocumentRequestResponse;
import com.ssotracker.dto.NotificationResponse;
import com.ssotracker.dto.RequestAssignmentRequest;
import com.ssotracker.dto.RequestStatusUpdateRequest;
import com.ssotracker.repository.NotificationRepository;
import com.ssotracker.service.DocumentRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/document-requests")
public class DocumentRequestController {

    private final DocumentRequestService documentRequestService;
    private final NotificationRepository notificationRepository;

    public DocumentRequestController(DocumentRequestService documentRequestService, NotificationRepository notificationRepository) {
        this.documentRequestService = documentRequestService;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    List<DocumentRequestResponse> findAll() {
        return documentRequestService.findAll().stream()
                .map(DocumentRequestResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    DocumentRequestResponse findById(@PathVariable Long id) {
        return DocumentRequestResponse.from(documentRequestService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    DocumentRequestResponse submit(@Valid @RequestBody DocumentRequestCreateRequest request) {
        return DocumentRequestResponse.from(documentRequestService.submit(request));
    }

    @PatchMapping("/{id}/assignment")
    DocumentRequestResponse assignStaff(@PathVariable Long id, @Valid @RequestBody RequestAssignmentRequest request) {
        return DocumentRequestResponse.from(documentRequestService.assignStaff(id, request.staffId()));
    }

    @PatchMapping("/{id}/status")
    DocumentRequestResponse updateStatus(@PathVariable Long id, @Valid @RequestBody RequestStatusUpdateRequest request) {
        return DocumentRequestResponse.from(documentRequestService.updateStatus(id, request.status()));
    }

    @PostMapping("/{id}/ping-admin")
    @ResponseStatus(HttpStatus.CREATED)
    NotificationResponse pingAdmin(@PathVariable Long id) {
        return NotificationResponse.from(documentRequestService.pingAdmin(id));
    }

    @GetMapping("/{id}/notifications")
    List<NotificationResponse> findNotifications(@PathVariable Long id) {
        documentRequestService.findById(id);
        return notificationRepository.findByDocumentRequestRequestIdOrderByDateSentDesc(id).stream()
                .map(NotificationResponse::from)
                .toList();
    }
}
