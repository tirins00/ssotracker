package com.ssotracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record StaffRequest(
        @NotBlank String firstname,
        @NotBlank String lastname,
        @NotBlank String position,
        @NotBlank @Email String email
) {
}