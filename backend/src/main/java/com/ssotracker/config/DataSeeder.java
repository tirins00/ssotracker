package com.ssotracker.config;

import com.ssotracker.model.AdminUser;
import com.ssotracker.model.DocumentRequirement;
import com.ssotracker.model.Staff;
import com.ssotracker.model.Student;
import com.ssotracker.repository.AdminUserRepository;
import com.ssotracker.repository.DocumentRequirementRepository;
import com.ssotracker.repository.StaffRepository;
import com.ssotracker.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedIncrementData(
            AdminUserRepository adminUserRepository,
            StudentRepository studentRepository,
            StaffRepository staffRepository,
            DocumentRequirementRepository requirementRepository
    ) {
        return args -> {
            if (adminUserRepository.count() == 0) {
                AdminUser admin = new AdminUser();
                admin.setFirstName("System");
                admin.setLastName("Admin");
                admin.setEmail("admin@cit.edu");
                admin.setPosition("SSO Administrator");
                adminUserRepository.save(admin);
            }

            if (studentRepository.count() == 0) {
                Student student = new Student();
                student.setFirstName("Denzel");
                student.setLastName("Valendez");
                student.setEmail("denzel.valendez@cit.edu");
                student.setYearLevel(3);
                studentRepository.save(student);
            }

            if (staffRepository.count() == 0) {
                Staff staff = new Staff();
                staff.setFirstname("Maria");
                staff.setLastname("Santos");
                staff.setPosition("Records Staff");
                staff.setEmail("staff1@cit.edu");
                staffRepository.save(staff);
            }

            if (requirementRepository.count() == 0) {
                seedRequirement(requirementRepository, "Good Moral Certificate", "Student ID, clearance status, and request purpose.");
                seedRequirement(requirementRepository, "Certificate of Good Standing", "Student ID and current enrollment validation.");
                seedRequirement(requirementRepository, "Enrollment Certificate", "Student ID and active enrollment record.");
                seedRequirement(requirementRepository, "Student Clearance", "Student ID and completed clearance checklist.");
            }
        };
    }

    private void seedRequirement(DocumentRequirementRepository repository, String type, String details) {
        DocumentRequirement requirement = new DocumentRequirement();
        requirement.setDocumentType(type);
        requirement.setDocumentDetails(details);
        repository.save(requirement);
    }
}
