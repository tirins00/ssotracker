package com.ssotracker.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "document_request")
public class DocumentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @NotBlank
    @Column(name = "request_type", nullable = false)
    private String requestType;

    @NotNull
    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @NotNull
    @Min(1)
    @Column(name = "expected_processing_time", nullable = false)
    private Integer expectedProcessingTime;

    @NotNull
    @Min(1)
    @Column(name = "queue_position", nullable = false)
    private Integer queuePosition;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String purpose;

    @Column(length = 1000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false)
    private DocumentRequirement documentRequirement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_staff_id")
    private Staff assignedStaff;

    @OneToMany(mappedBy = "documentRequest")
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "documentRequest")
    private List<Report> reports = new ArrayList<>();

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public Integer getExpectedProcessingTime() {
        return expectedProcessingTime;
    }

    public void setExpectedProcessingTime(Integer expectedProcessingTime) {
        this.expectedProcessingTime = expectedProcessingTime;
    }

    public Integer getQueuePosition() {
        return queuePosition;
    }

    public void setQueuePosition(Integer queuePosition) {
        this.queuePosition = queuePosition;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public DocumentRequirement getDocumentRequirement() {
        return documentRequirement;
    }

    public void setDocumentRequirement(DocumentRequirement documentRequirement) {
        this.documentRequirement = documentRequirement;
    }

    public Staff getAssignedStaff() {
        return assignedStaff;
    }

    public void setAssignedStaff(Staff assignedStaff) {
        this.assignedStaff = assignedStaff;
    }
}
