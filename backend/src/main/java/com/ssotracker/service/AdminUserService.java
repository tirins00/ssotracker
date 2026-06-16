package com.ssotracker.service;

import com.ssotracker.dto.AdminUserRequest;
import com.ssotracker.model.AdminUser;
import com.ssotracker.repository.AdminUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;

    public AdminUserService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    public List<AdminUser> findAll() {
        return adminUserRepository.findAll();
    }

    public AdminUser findById(Long id) {
        return adminUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found: " + id));
    }

    public AdminUser getAdminProfile(Long id) {
        // Read-only profile view
        return adminUserRepository.getAdminProfileById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin profile not found: " + id));
    }

    @Transactional
    public AdminUser create(AdminUserRequest request) {
        if (adminUserRepository.count() > 0) {
            throw new DuplicateEmailException("Only one admin account is allowed.");
        }
        if (adminUserRepository.existsByEmail(request.email())) {
            throw new DuplicateEmailException("Email already exists: " + request.email());
        }

        AdminUser admin = new AdminUser();
        apply(admin, request);
        admin.setEmail("Admin@cit.edu");
        admin.setPassword("Admin123!");
        admin.setMustChangePassword(false);
        admin.setActive(true);
        return adminUserRepository.save(admin);
    }

    @Transactional
    public AdminUser update(Long id, AdminUserRequest request) {
        AdminUser admin = findById(id);
        apply(admin, request);
        admin.setEmail("Admin@cit.edu");
        admin.setPassword("Admin123!");
        admin.setMustChangePassword(false);
        admin.setActive(true);
        return admin;
    }

    @Transactional
    public void delete(Long id) {
        throw new DuplicateEmailException("The only admin account cannot be deleted.");
    }

    @Transactional
    public AdminUser updatePassword(Long id, String password) {
        AdminUser admin = findById(id);
        admin.setPassword(password);
        admin.setMustChangePassword(false);
        return admin;
    }

    private void apply(AdminUser admin, AdminUserRequest request) {
        admin.setFirstName(request.firstName());
        admin.setLastName(request.lastName());
        admin.setEmail(request.email());
        admin.setPosition(request.position());
        admin.setActive(request.active() == null || request.active());
        if (request.password() != null && !request.password().isBlank()) {
            admin.setPassword(request.password());
            admin.setMustChangePassword(false);
        }
    }
}
