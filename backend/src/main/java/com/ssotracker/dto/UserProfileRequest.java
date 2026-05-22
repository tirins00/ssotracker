package com.ssotracker.dto;

import jakarta.validation.constraints.NotBlank;

public record UserProfileRequest(
        @NotBlank String firstName,
        @NotBlank String lastName
) {
}
