package com.ssotracker.service;

import com.ssotracker.dto.StaffRequest;
import com.ssotracker.model.Staff;
import com.ssotracker.repository.StaffRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StaffService {

    public static final String DEFAULT_PASSWORD = "123456";

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<Staff> findAll() {
        return staffRepository.findAll();
    }

    public Staff findById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + id));
    }

    @Transactional
    public Staff create(StaffRequest request) {
        if (staffRepository.findByEmailIgnoreCase(request.email()).isPresent()) {
            throw new DuplicateEmailException("Email already exists: " + request.email());
        }

        Staff staff = new Staff();
        apply(staff, request);
        staff.setPassword(DEFAULT_PASSWORD);
        staff.setMustChangePassword(true);
        return staffRepository.save(staff);
    }

    @Transactional
    public Staff update(Long id, StaffRequest request) {
        Staff staff = findById(id);
        staffRepository.findByEmailIgnoreCase(request.email())
                .filter(existing -> !existing.getStaffId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateEmailException("Email already exists: " + request.email());
                });
        apply(staff, request);
        return staff;
    }

    @Transactional
    public void delete(Long id) {
        Staff staff = findById(id);
        staffRepository.delete(staff);
    }

    @Transactional
    public Staff updatePassword(Long id, String password) {
        Staff staff = findById(id);
        staff.setPassword(password);
        staff.setMustChangePassword(false);
        return staff;
    }

    private void apply(Staff staff, StaffRequest request) {
        staff.setFirstname(request.firstname());
        staff.setLastname(request.lastname());
        staff.setPosition(request.position());
        staff.setEmail(request.email());
    }
}
