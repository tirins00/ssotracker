package com.ssotracker.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminPasswordUpdateRequest(
        @NotBlank String password
) {
}
