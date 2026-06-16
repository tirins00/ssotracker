package com.ssotracker.dto;

import com.ssotracker.model.RequestStatus;
import jakarta.validation.constraints.NotNull;

public record RequestStatusUpdateRequest(@NotNull RequestStatus status) {
}
