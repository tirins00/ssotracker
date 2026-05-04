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

    @Transactional
    public AdminUser create(AdminUserRequest request) {
        if (adminUserRepository.existsByEmail(request.email())) {
            throw new DuplicateEmailException("Email already exists: " + request.email());
        }

        AdminUser admin = new AdminUser();
        apply(admin, request);
        return adminUserRepository.save(admin);
    }

    @Transactional
    public AdminUser update(Long id, AdminUserRequest request) {
        AdminUser admin = findById(id);
        adminUserRepository.findByEmail(request.email())
                .filter(existing -> !existing.getAdminId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateEmailException("Email already exists: " + request.email());
                });
        apply(admin, request);
        return admin;
    }

    @Transactional
    public void delete(Long id) {
        AdminUser admin = findById(id);
        adminUserRepository.delete(admin);
    }

    private void apply(AdminUser admin, AdminUserRequest request) {
        admin.setFirstName(request.firstName());
        admin.setLastName(request.lastName());
        admin.setEmail(request.email());
        admin.setPosition(request.position());
        admin.setActive(request.active() == null || request.active());
    }
}
