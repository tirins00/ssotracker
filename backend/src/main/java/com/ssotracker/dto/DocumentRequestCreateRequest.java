package com.ssotracker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DocumentRequestCreateRequest(
        Long studentId,
        String studentName,
        String studentEmail,
        @NotNull Long documentId,
        @NotBlank String requestType,
        @NotNull @Min(1) Integer expectedProcessingTime,
        @NotBlank String purpose,
        String notes
) {
}
