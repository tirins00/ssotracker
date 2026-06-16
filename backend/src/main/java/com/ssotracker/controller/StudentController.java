package com.ssotracker.controller;

import com.ssotracker.dto.StudentRequest;
import com.ssotracker.dto.StudentResponse;
import com.ssotracker.dto.AdminPasswordUpdateRequest;
import com.ssotracker.service.StudentService;
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
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    List<StudentResponse> findAll() {
        return studentService.findAll().stream()
                .map(StudentResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    StudentResponse findById(@PathVariable Long id) {
        return StudentResponse.from(studentService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    StudentResponse create(@Valid @RequestBody StudentRequest request) {
        return StudentResponse.from(studentService.create(request));
    }

    @PutMapping("/{id}")
    StudentResponse update(@PathVariable Long id, @Valid @RequestBody StudentRequest request) {
        return StudentResponse.from(studentService.update(id, request));
    }

    @PutMapping("/{id}/password")
    StudentResponse updatePassword(@PathVariable Long id, @Valid @RequestBody AdminPasswordUpdateRequest request) {
        return StudentResponse.from(studentService.updatePassword(id, request.password()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long id) {
        studentService.delete(id);
    }
}