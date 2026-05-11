package com.ssotracker.service;

import com.ssotracker.dto.StaffRequest;
import com.ssotracker.model.Staff;
import com.ssotracker.repository.StaffRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StaffService {

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
        if (staffRepository.findByEmail(request.email()).isPresent()) {
            throw new DuplicateEmailException("Email already exists: " + request.email());
        }

        Staff staff = new Staff();
        apply(staff, request);
        return staffRepository.save(staff);
    }

    @Transactional
    public Staff update(Long id, StaffRequest request) {
        Staff staff = findById(id);
        staffRepository.findByEmail(request.email())
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

    private void apply(Staff staff, StaffRequest request) {
        staff.setFirstname(request.firstname());
        staff.setLastname(request.lastname());
        staff.setPosition(request.position());
        staff.setEmail(request.email());
    }
}