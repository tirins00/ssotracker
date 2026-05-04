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

            seedMissingRequirement(requirementRepository, "Excuse Slip", "Absence details, supporting proof, and request purpose.");
            seedMissingRequirement(requirementRepository, "Good Moral Certificate", "Student ID, clearance status, and request purpose.");
            seedMissingRequirement(requirementRepository, "Certificate of Good Standing", "Student ID and current enrollment validation.");
            seedMissingRequirement(requirementRepository, "Enrollment Certificate", "Student ID and active enrollment record.");
            seedMissingRequirement(requirementRepository, "Indigency Certificate", "Student ID, financial need details, and request purpose.");
            seedMissingRequirement(requirementRepository, "Scholarship Endorsement Letter", "Scholarship details and required endorsement information.");
            seedMissingRequirement(requirementRepository, "Student Clearance", "Student ID and completed clearance checklist.");
            seedMissingRequirement(requirementRepository, "Transfer Credentials", "Transfer destination details and clearance validation.");
        };
    }

    private void seedMissingRequirement(DocumentRequirementRepository repository, String type, String details) {
        if (repository.existsByDocumentType(type)) {
            return;
        }

        DocumentRequirement requirement = new DocumentRequirement();
        requirement.setDocumentType(type);
        requirement.setDocumentDetails(details);
        repository.save(requirement);
    }
}
