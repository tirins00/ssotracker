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
        String purpose,
        String notes,
        Long studentId,
        String studentEmail,
        String studentName,
        Long documentId,
        String documentType,
        Long assignedStaffId,
        String assignedStaffEmail,
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
                request.getPurpose(),
                request.getNotes(),
                request.getStudent().getUserId(),
                request.getStudent().getEmail(),
                request.getStudent().getFirstName() + " " + request.getStudent().getLastName(),
                request.getDocumentRequirement().getDocumentId(),
                request.getDocumentRequirement().getDocumentType(),
                request.getAssignedStaff() == null ? null : request.getAssignedStaff().getStaffId(),
                request.getAssignedStaff() == null ? null : request.getAssignedStaff().getEmail(),
                staffName
        );
    }
}
