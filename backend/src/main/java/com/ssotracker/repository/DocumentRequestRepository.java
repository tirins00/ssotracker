package com.ssotracker.repository;

import com.ssotracker.model.DocumentRequest;
import com.ssotracker.model.RequestStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRequestRepository extends JpaRepository<DocumentRequest, Long> {
    @Override
    @EntityGraph(attributePaths = {"student", "documentRequirement", "assignedStaff"})
    List<DocumentRequest> findAll();

    @Override
    @EntityGraph(attributePaths = {"student", "documentRequirement", "assignedStaff"})
    Optional<DocumentRequest> findById(Long id);

    @EntityGraph(attributePaths = {"student", "documentRequirement", "assignedStaff"})
    List<DocumentRequest> findByStatusOrderByQueuePositionAsc(RequestStatus status);

    long countByStatusNot(RequestStatus status);
}
