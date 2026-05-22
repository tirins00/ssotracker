package com.ssotracker.dto;

import com.ssotracker.model.Staff;

public record StaffResponse(
        Long staffId,
        String firstname,
        String lastname,
        String position,
        String email,
        String password,
        boolean mustChangePassword
) {
    public static StaffResponse from(Staff staff) {
        return new StaffResponse(
                staff.getStaffId(),
                staff.getFirstname(),
                staff.getLastname(),
                staff.getPosition(),
                staff.getEmail(),
                staff.getPassword(),
                staff.isMustChangePassword()
        );
    }
}
