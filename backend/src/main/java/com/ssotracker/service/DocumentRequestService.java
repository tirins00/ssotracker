package com.ssotracker.service;

import com.ssotracker.dto.DocumentRequestCreateRequest;
import com.ssotracker.dto.RequestAssignmentRequest;
import com.ssotracker.model.DocumentRequest;
import com.ssotracker.model.Notification;
import com.ssotracker.model.NotificationType;
import com.ssotracker.model.RequestStatus;
import com.ssotracker.model.Staff;
import com.ssotracker.model.Student;
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
        documentRequest.setStudent(resolveStudent(request));
        documentRequest.setDocumentRequirement(requirementRepository.findById(request.documentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document requirement not found: " + request.documentId())));
        documentRequest.setRequestType(request.requestType());
        documentRequest.setRequestDate(LocalDate.now());
        documentRequest.setExpectedProcessingTime(request.expectedProcessingTime());
        documentRequest.setStatus(RequestStatus.PENDING);
        documentRequest.setQueuePosition((int) requestRepository.countByStatusNot(RequestStatus.COMPLETED) + 1);
        documentRequest.setPurpose(request.purpose().trim());
        documentRequest.setNotes(request.notes() == null ? "" : request.notes().trim());

        DocumentRequest saved = requestRepository.save(documentRequest);
        addNotification(saved, NotificationType.SUBMIT, "Document request submitted and added to the queue.");
        return saved;
    }

    private Student resolveStudent(DocumentRequestCreateRequest request) {
        if (request.studentId() != null) {
            return studentRepository.findById(request.studentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + request.studentId()));
        }

        String email = request.studentEmail() == null ? "" : request.studentEmail().trim().toLowerCase();
        if (email.isBlank()) {
            throw new ResourceNotFoundException("Student email is required when studentId is not provided.");
        }

        return studentRepository.findByEmail(email)
                .orElseGet(() -> createStudent(request.studentName(), email));
    }

    private Student createStudent(String studentName, String email) {
        String name = studentName == null ? "" : studentName.trim();
        String[] parts = name.isBlank() ? new String[0] : name.split("\\s+");
        Student student = new Student();
        student.setFirstName(parts.length == 0 ? "Student" : parts[0]);
        student.setLastName(parts.length <= 1 ? "User" : parts[parts.length - 1]);
        student.setEmail(email);
        student.setYearLevel(1);
        return studentRepository.save(student);
    }

    @Transactional
    public DocumentRequest assignStaff(Long requestId, RequestAssignmentRequest request) {
        DocumentRequest documentRequest = findById(requestId);
        Staff staff = resolveStaff(request);
        documentRequest.setAssignedStaff(staff);
        documentRequest.setStatus(RequestStatus.IN_REVIEW);
        addNotification(documentRequest, NotificationType.ASSIGNMENT, "Request assigned to " + staff.getFirstname() + " " + staff.getLastname() + ".");
        return documentRequest;
    }

    private Staff resolveStaff(RequestAssignmentRequest request) {
        if (request.staffId() != null) {
            return staffRepository.findById(request.staffId())
                    .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + request.staffId()));
        }

        String email = request.staffEmail() == null ? "" : request.staffEmail().trim().toLowerCase();
        if (email.isBlank()) {
            throw new ResourceNotFoundException("Staff id or email is required.");
        }

        return staffRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + email));
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
        documentRequest.setAdminPingedAt(LocalDateTime.now());
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
