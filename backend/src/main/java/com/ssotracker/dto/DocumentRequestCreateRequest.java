package com.ssotracker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DocumentRequestCreateRequest(
        @NotNull Long studentId,
        @NotNull Long documentId,
        @NotBlank String requestType,
        @NotNull @Min(1) Integer expectedProcessingTime
) {
}
