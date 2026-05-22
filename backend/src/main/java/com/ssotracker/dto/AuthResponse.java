package com.ssotracker.dto;

public record AuthResponse(
        Long userId,
        String email,
        String role,
        String firstName,
        String lastName,
        String displayName,
        String position,
        Boolean active,
        Boolean mustChangePassword
) {
    public static AuthResponse from(Long userId, String email, String role, String firstName, String lastName, boolean mustChangePassword) {
        return new AuthResponse(userId, email, role, firstName, lastName, lastName + " " + firstName, null, null, mustChangePassword);
    }

    public static AuthResponse fromAdmin(Long adminId, String email, String firstName, String lastName, String position, boolean active, boolean mustChangePassword) {
        return new AuthResponse(adminId, email, "admin", firstName, lastName, lastName + " " + firstName, position, active, mustChangePassword);
    }
}
