package com.ssotracker.dto;

public record UserProfileResponse(
        String email,
        String firstName,
        String lastName,
        String role
) {
}