package com.ssotracker.dto;

import com.ssotracker.model.DocumentRequest;
import com.ssotracker.model.RequestStatus;

import java.time.LocalDate;

public record DocumentRequestResponse(
        Long requestId,
        String requestType,
        LocalDate requestDate,
        RequestStatus status,
        Integer expectedProcessingTime,
        Integer queuePosition,
        Long studentId,
        String studentName,
        Long documentId,
        String documentType,
        Long assignedStaffId,
        String assignedStaffName
) {
    public static DocumentRequestResponse from(DocumentRequest request) {
        String staffName = request.getAssignedStaff() == null
                ? null
                : request.getAssignedStaff().getFirstname() + " " + request.getAssignedStaff().getLastname();

        return new DocumentRequestResponse(
                request.getRequestId(),
                request.getRequestType(),
                request.getRequestDate(),
                request.getStatus(),
                request.getExpectedProcessingTime(),
                request.getQueuePosition(),
                request.getStudent().getUserId(),
                request.getStudent().getFirstName() + " " + request.getStudent().getLastName(),
                request.getDocumentRequirement().getDocumentId(),
                request.getDocumentRequirement().getDocumentType(),
                request.getAssignedStaff() == null ? null : request.getAssignedStaff().getStaffId(),
                staffName
        );
    }
}
