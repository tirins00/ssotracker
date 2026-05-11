package com.ssotracker.dto;

import com.ssotracker.model.Student;

public record StudentResponse(
        Long userId,
        String firstName,
        String lastName,
        String email,
        Integer yearLevel
) {
    public static StudentResponse from(Student student) {
        return new StudentResponse(
                student.getUserId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getYearLevel()
        );
    }
}