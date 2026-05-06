package com.ssotracker.service;

import com.ssotracker.dto.UserProfileRequest;
import com.ssotracker.dto.UserProfileResponse;
import com.ssotracker.model.Staff;
import com.ssotracker.model.Student;
import com.ssotracker.repository.StaffRepository;
import com.ssotracker.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;

    public UserService(StudentRepository studentRepository, StaffRepository staffRepository) {
        this.studentRepository = studentRepository;
        this.staffRepository = staffRepository;
    }

    @Transactional
    public UserProfileResponse updateProfile(String email, UserProfileRequest request) {
        // Try to find as student first
        var studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            student.setEmail(request.email());
            student.setFirstName(request.firstName());
            student.setLastName(request.lastName());
            studentRepository.save(student);
            return new UserProfileResponse(request.email(), request.firstName(), request.lastName(), "student");
        }

        // Try to find as staff
        var staffOpt = staffRepository.findByEmail(email);
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            staff.setEmail(request.email());
            staff.setFirstname(request.firstName());
            staff.setLastname(request.lastName());
            staffRepository.save(staff);
            return new UserProfileResponse(request.email(), request.firstName(), request.lastName(), "staff");
        }

        throw new ResourceNotFoundException("User not found with email: " + email);
    }

    public UserProfileResponse getProfile(String email) {
        // Try to find as student first
        var studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            return new UserProfileResponse(student.getEmail(), student.getFirstName(), student.getLastName(), "student");
        }

        // Try to find as staff
        var staffOpt = staffRepository.findByEmail(email);
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            return new UserProfileResponse(staff.getEmail(), staff.getFirstname(), staff.getLastname(), "staff");
        }

        throw new ResourceNotFoundException("User not found with email: " + email);
    }
}