package com.ssotracker.service;

import com.ssotracker.dto.AuthRequest;
import com.ssotracker.dto.AuthResponse;
import com.ssotracker.model.AdminUser;
import com.ssotracker.model.Staff;
import com.ssotracker.model.Student;
import com.ssotracker.repository.AdminUserRepository;
import com.ssotracker.repository.StaffRepository;
import com.ssotracker.repository.StudentRepository;
import org.springframework.stereotype.Service;
import com.ssotracker.service.ResourceNotFoundException;

@Service
public class AuthService {

    private static final String DEFAULT_ADMIN_EMAIL = "admin@cit.edu";

    private final AdminUserRepository adminUserRepository;
    private final StaffRepository staffRepository;
    private final StudentRepository studentRepository;

    public AuthService(AdminUserRepository adminUserRepository,
                       StaffRepository staffRepository,
                       StudentRepository studentRepository) {
        this.adminUserRepository = adminUserRepository;
        this.staffRepository = staffRepository;
        this.studentRepository = studentRepository;
    }

    public AuthResponse login(AuthRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        String role = request.role().trim().toLowerCase();

        switch (role) {
            case "admin":
                return loginAdmin(normalizedEmail, request.password());
            case "staff":
                return loginStaff(normalizedEmail);
            case "student":
                return loginStudent(normalizedEmail);
            default:
                throw new ResourceNotFoundException("Unsupported role: " + request.role());
        }
    }

    private AuthResponse loginAdmin(String email, String password) {
        if (!DEFAULT_ADMIN_EMAIL.equals(email)) {
            throw new ResourceNotFoundException("Invalid admin credentials");
        }

        AdminUser admin = adminUserRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid admin credentials"));
        if (!admin.isActive()) {
            throw new ResourceNotFoundException("Admin account is inactive");
        }
        if (admin.getPassword() == null || !admin.getPassword().equals(password)) {
            throw new ResourceNotFoundException("Invalid admin credentials");
        }
        return AuthResponse.from(admin.getEmail(), "admin", admin.getFirstName(), admin.getLastName());
    }

    private AuthResponse loginStaff(String email) {
        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff account not found"));
        return AuthResponse.from(staff.getEmail(), "staff", staff.getFirstname(), staff.getLastname());
    }

    private AuthResponse loginStudent(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student account not found"));
        return AuthResponse.from(student.getEmail(), "student", student.getFirstName(), student.getLastName());
    }
}
