package com.ssotracker.dto;

import com.ssotracker.model.AdminUser;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long adminId,
        String firstName,
        String lastName,
        String email,
        String position,
        boolean active,
        LocalDateTime createdAt
) {
    public static AdminUserResponse from(AdminUser adminUser) {
        return new AdminUserResponse(
                adminUser.getAdminId(),
                adminUser.getFirstName(),
                adminUser.getLastName(),
                adminUser.getEmail(),
                adminUser.getPosition(),
                adminUser.isActive(),
                adminUser.getCreatedAt()
        );
    }
}
