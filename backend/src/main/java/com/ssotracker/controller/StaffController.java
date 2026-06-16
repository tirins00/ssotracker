package com.ssotracker.controller;

import com.ssotracker.dto.StaffRequest;
import com.ssotracker.dto.StaffResponse;
import com.ssotracker.dto.AdminPasswordUpdateRequest;
import com.ssotracker.service.StaffService;
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
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    List<StaffResponse> findAll() {
        return staffService.findAll().stream()
                .map(StaffResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    StaffResponse findById(@PathVariable Long id) {
        return StaffResponse.from(staffService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    StaffResponse create(@Valid @RequestBody StaffRequest request) {
        return StaffResponse.from(staffService.create(request));
    }

    @PutMapping("/{id}")
    StaffResponse update(@PathVariable Long id, @Valid @RequestBody StaffRequest request) {
        return StaffResponse.from(staffService.update(id, request));
    }

    @PutMapping("/{id}/password")
    StaffResponse updatePassword(@PathVariable Long id, @Valid @RequestBody AdminPasswordUpdateRequest request) {
        return StaffResponse.from(staffService.updatePassword(id, request.password()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long id) {
        staffService.delete(id);
    }
}