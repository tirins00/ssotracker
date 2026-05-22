package com.ssotracker.service;

import com.ssotracker.dto.StudentRequest;
import com.ssotracker.model.Student;
import com.ssotracker.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    public static final String DEFAULT_PASSWORD = "123456";

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Student findById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));
    }

    @Transactional
    public Student create(StudentRequest request) {
        if (studentRepository.findByEmailIgnoreCase(request.email()).isPresent()) {
            throw new DuplicateEmailException("Email already exists: " + request.email());
        }

        Student student = new Student();
        apply(student, request);
        student.setPassword(DEFAULT_PASSWORD);
        student.setMustChangePassword(true);
        return studentRepository.save(student);
    }

    @Transactional
    public Student update(Long id, StudentRequest request) {
        Student student = findById(id);
        studentRepository.findByEmailIgnoreCase(request.email())
                .filter(existing -> !existing.getUserId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateEmailException("Email already exists: " + request.email());
                });
        apply(student, request);
        return student;
    }

    @Transactional
    public void delete(Long id) {
        Student student = findById(id);
        studentRepository.delete(student);
    }

    @Transactional
    public Student updatePassword(Long id, String password) {
        Student student = findById(id);
        student.setPassword(password);
        student.setMustChangePassword(false);
        return student;
    }

    private void apply(Student student, StudentRequest request) {
        student.setFirstName(request.firstName());
        student.setLastName(request.lastName());
        student.setEmail(request.email());
        student.setYearLevel(request.yearLevel());
    }
}
