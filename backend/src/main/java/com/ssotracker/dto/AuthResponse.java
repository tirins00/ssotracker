package com.ssotracker.dto;

public record AuthResponse(
        String email,
        String role,
        String firstName,
        String lastName,
        String displayName
) {
    public static AuthResponse from(String email, String role, String firstName, String lastName) {
        return new AuthResponse(email, role, firstName, lastName, lastName + " " + firstName);
    }
}
