package com.ssotracker.dto;

import jakarta.validation.constraints.NotNull;

public record RequestAssignmentRequest(@NotNull Long staffId) {
}
