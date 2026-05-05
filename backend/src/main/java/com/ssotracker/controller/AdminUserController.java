package com.ssotracker.controller;

import com.ssotracker.dto.AdminUserRequest;
import com.ssotracker.dto.AdminUserResponse;
import com.ssotracker.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin-users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    List<AdminUserResponse> findAll() {
        return adminUserService.findAll().stream()
                .map(AdminUserResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    AdminUserResponse findById(@PathVariable Long id) {
        return AdminUserResponse.from(adminUserService.findById(id));
    }

    @GetMapping("/profile/{id}")
    AdminUserResponse getProfile(@PathVariable Long id) {
        // Read-only profile view (not editable)
        return AdminUserResponse.from(adminUserService.getAdminProfile(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    AdminUserResponse create(@Valid @RequestBody AdminUserRequest request) {
        return AdminUserResponse.from(adminUserService.create(request));
    }

    @PutMapping("/{id}")
    AdminUserResponse update(@PathVariable Long id, @Valid @RequestBody AdminUserRequest request) {
        return AdminUserResponse.from(adminUserService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long id) {
        adminUserService.delete(id);
    }
}
