package com.ssotracker.dto;

import com.ssotracker.model.DocumentRequirement;

public record DocumentRequirementResponse(
        Long documentId,
        String documentType,
        String documentDetails
) {
    public static DocumentRequirementResponse from(DocumentRequirement requirement) {
        return new DocumentRequirementResponse(
                requirement.getDocumentId(),
                requirement.getDocumentType(),
                requirement.getDocumentDetails()
        );
    }
}
