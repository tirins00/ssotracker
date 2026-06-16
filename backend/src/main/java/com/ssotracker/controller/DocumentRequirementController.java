package com.ssotracker.controller;

import com.ssotracker.dto.DocumentRequirementResponse;
import com.ssotracker.repository.DocumentRequirementRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/document-requirements")
public class DocumentRequirementController {

    private final DocumentRequirementRepository repository;

    public DocumentRequirementController(DocumentRequirementRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    List<DocumentRequirementResponse> findAll() {
        return repository.findAll().stream()
                .map(DocumentRequirementResponse::from)
                .toList();
    }
}
