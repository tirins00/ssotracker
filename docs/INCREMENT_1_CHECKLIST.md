# Increment 1 Checking Checklist

## 1. CRUD of the Admin User

Backend location: `backend/src/main/java/com/ssotracker/controller/AdminUserController.java`
Frontend location: `ssotracker/src/pages/AdminDashboardPage.jsx`

| Operation | Endpoint | Expected Result |
| --- | --- | --- |
| Create | `POST /api/admin-users` | Creates an admin user and returns `201 Created` |
| Read all | `GET /api/admin-users` | Lists admin users |
| Read one | `GET /api/admin-users/{id}` | Shows one admin user |
| Update | `PUT /api/admin-users/{id}` | Updates admin name, email, position, and active state |
| Delete | `DELETE /api/admin-users/{id}` | Deletes admin user and returns `204 No Content` |

Validation included:

- Required first name, last name, email, and position
- Email format validation
- Duplicate email conflict handling
- Not-found handling

## 2. Database Structure Based on ERD

Implemented JPA entities:

| ERD Entity | Java Entity | Table |
| --- | --- | --- |
| Student | `Student` | `student` |
| Staff | `Staff` | `staff` |
| DocumentRequirement | `DocumentRequirement` | `document_requirement` |
| DocumentRequest | `DocumentRequest` | `document_request` |
| Notification | `Notification` | `notification` |
| Report | `Report` | `report` |
| Admin user for increment CRUD | `AdminUser` | `admin_user` |

Relationships implemented:

- Student submits many document requests.
- Document request requires one document requirement.
- Document request triggers many notifications.
- Staff generates many reports.
- Report belongs to one document request.
- Staff can be assigned to document requests for processing.

## 3. Behavior Based on Use Case and Activity Diagrams

Implemented workflow:

1. Student selects an available document requirement.
2. Student submits a document request.
3. System sets request date, pending status, expected processing time, and queue position.
4. System creates a submit notification.
5. Admin assigns staff to the request.
6. System changes status to `IN_REVIEW` and creates an assignment notification.
7. Staff/admin updates request status to `PROCESSING`, `COMPLETED`, or `REJECTED`.
8. System creates a status-update notification.
9. Student can ping admin for overdue follow-up.

## 4. Documents to Prepare During Checking

Keep these open or ready:

- ERD diagram
- Use Case Diagram
- Activity Diagram
- This checklist
- Backend API README: `backend/README.md`
- Running Spring Boot app or screenshots from Postman/H2 console

## 5. Suggested Checking Script

1. Run the Spring Boot app.
2. Open H2 console and show the ERD-aligned tables.
3. Use Postman or browser requests to show `GET /api/admin-users`.
4. Create a new admin with `POST /api/admin-users`.
5. Update the admin with `PUT /api/admin-users/{id}`.
6. Delete the admin with `DELETE /api/admin-users/{id}`.
7. Sign in as Admin in the React app and show the Admin Users panel doing the same CRUD calls.
8. Submit a document request with `POST /api/document-requests`.
9. Assign staff with `PATCH /api/document-requests/{id}/assignment`.
10. Update status with `PATCH /api/document-requests/{id}/status`.
11. Show notifications with `GET /api/document-requests/{id}/notifications`.
