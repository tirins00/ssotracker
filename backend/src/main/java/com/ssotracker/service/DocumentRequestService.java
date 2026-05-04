package com.ssotracker.service;

import com.ssotracker.dto.DocumentRequestCreateRequest;
import com.ssotracker.model.DocumentRequest;
import com.ssotracker.model.Notification;
import com.ssotracker.model.NotificationType;
import com.ssotracker.model.RequestStatus;
import com.ssotracker.model.Staff;
import com.ssotracker.repository.DocumentRequestRepository;
import com.ssotracker.repository.DocumentRequirementRepository;
import com.ssotracker.repository.NotificationRepository;
import com.ssotracker.repository.StaffRepository;
import com.ssotracker.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentRequestService {

    private final DocumentRequestRepository requestRepository;
    private final StudentRepository studentRepository;
    private final DocumentRequirementRepository requirementRepository;
    private final StaffRepository staffRepository;
    private final NotificationRepository notificationRepository;

    public DocumentRequestService(
            DocumentRequestRepository requestRepository,
            StudentRepository studentRepository,
            DocumentRequirementRepository requirementRepository,
            StaffRepository staffRepository,
            NotificationRepository notificationRepository
    ) {
        this.requestRepository = requestRepository;
        this.studentRepository = studentRepository;
        this.requirementRepository = requirementRepository;
        this.staffRepository = staffRepository;
        this.notificationRepository = notificationRepository;
    }

    public List<DocumentRequest> findAll() {
        return requestRepository.findAll();
    }

    public DocumentRequest findById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document request not found: " + id));
    }

    @Transactional
    public DocumentRequest submit(DocumentRequestCreateRequest request) {
        DocumentRequest documentRequest = new DocumentRequest();
        documentRequest.setStudent(studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + request.studentId())));
        documentRequest.setDocumentRequirement(requirementRepository.findById(request.documentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document requirement not found: " + request.documentId())));
        documentRequest.setRequestType(request.requestType());
        documentRequest.setRequestDate(LocalDate.now());
        documentRequest.setExpectedProcessingTime(request.expectedProcessingTime());
        documentRequest.setStatus(RequestStatus.PENDING);
        documentRequest.setQueuePosition((int) requestRepository.countByStatusNot(RequestStatus.COMPLETED) + 1);

        DocumentRequest saved = requestRepository.save(documentRequest);
        addNotification(saved, NotificationType.SUBMIT, "Document request submitted and added to the queue.");
        return saved;
    }

    @Transactional
    public DocumentRequest assignStaff(Long requestId, Long staffId) {
        DocumentRequest documentRequest = findById(requestId);
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + staffId));
        documentRequest.setAssignedStaff(staff);
        documentRequest.setStatus(RequestStatus.IN_REVIEW);
        addNotification(documentRequest, NotificationType.ASSIGNMENT, "Request assigned to " + staff.getFirstname() + " " + staff.getLastname() + ".");
        return documentRequest;
    }

    @Transactional
    public DocumentRequest updateStatus(Long requestId, RequestStatus status) {
        DocumentRequest documentRequest = findById(requestId);
        documentRequest.setStatus(status);
        addNotification(documentRequest, NotificationType.STATUS_UPDATE, "Request status updated to " + status + ".");
        return documentRequest;
    }

    @Transactional
    public Notification pingAdmin(Long requestId) {
        DocumentRequest documentRequest = findById(requestId);
        return addNotification(documentRequest, NotificationType.PING, "Student pinged admin for overdue request follow-up.");
    }

    private Notification addNotification(DocumentRequest documentRequest, NotificationType type, String message) {
        Notification notification = new Notification();
        notification.setDocumentRequest(documentRequest);
        notification.setNotificationType(type);
        notification.setMessage(message);
        notification.setDateSent(LocalDateTime.now());
        return notificationRepository.save(notification);
    }
}
