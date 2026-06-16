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
        String normalizedEmail = request.email().trim();
        String role = request.role().trim().toLowerCase();

        switch (role) {
            case "admin":
                return loginAdmin(normalizedEmail, request.password());
            case "staff":
                return loginStaff(normalizedEmail, request.password());
            case "student":
                return loginStudent(normalizedEmail, request.password());
            default:
                throw new ResourceNotFoundException("Unsupported role: " + request.role());
        }
    }

    private AuthResponse loginAdmin(String email, String password) {
        AdminUser admin = adminUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid admin credentials"));
        if (!admin.isActive()) {
            throw new ResourceNotFoundException("Admin account is inactive");
        }
        if (admin.getPassword() == null || !admin.getPassword().equals(password)) {
            throw new ResourceNotFoundException("Invalid admin credentials");
        }
        return AuthResponse.fromAdmin(
                admin.getAdminId(),
                admin.getEmail(),
                admin.getFirstName(),
                admin.getLastName(),
                admin.getPosition(),
                admin.isActive(),
                admin.isMustChangePassword()
        );
    }

    private AuthResponse loginStaff(String email, String password) {
        Staff staff = staffRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff account not found"));
        if (staff.getPassword() == null || !staff.getPassword().equals(password)) {
            throw new ResourceNotFoundException("Invalid staff credentials");
        }
        if (StaffService.DEFAULT_PASSWORD.equals(staff.getPassword()) && !staff.isMustChangePassword()) {
            staff.setMustChangePassword(true);
            staffRepository.save(staff);
        }
        return AuthResponse.from(staff.getStaffId(), staff.getEmail(), "staff", staff.getFirstname(), staff.getLastname(), staff.isMustChangePassword());
    }

    private AuthResponse loginStudent(String email, String password) {
        Student student = studentRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student account not found"));
        if (student.getPassword() == null || !student.getPassword().equals(password)) {
            throw new ResourceNotFoundException("Invalid student credentials");
        }
        if (StudentService.DEFAULT_PASSWORD.equals(student.getPassword()) && !student.isMustChangePassword()) {
            student.setMustChangePassword(true);
            studentRepository.save(student);
        }
        return AuthResponse.from(student.getUserId(), student.getEmail(), "student", student.getFirstName(), student.getLastName(), student.isMustChangePassword());
    }
}
