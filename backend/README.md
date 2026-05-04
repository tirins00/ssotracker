# SSO Tracker API

Spring Boot backend for the first increment checking.

## What This Covers

- CRUD of the Admin user through `/api/admin-users`
- ERD-aligned JPA tables:
  - `admin_user`
  - `student`
  - `staff`
  - `document_requirement`
  - `document_request`
  - `notification`
  - `report`
- Use-case and activity behavior for:
  - student submits a document request
  - request is queued
  - notification is triggered
  - admin/staff assigns and updates request status
  - student pings admin for overdue follow-up

## Run

```powershell
cd backend
mvn spring-boot:run
```

The API runs at `http://localhost:8080`.

H2 database console:

```text
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:ssotracker
Username: sa
Password: 
```

## Admin User CRUD

Create:

```http
POST /api/admin-users
Content-Type: application/json

{
  "firstName": "Ana",
  "lastName": "Reyes",
  "email": "ana.reyes@cit.edu",
  "position": "Registrar Admin",
  "active": true
}
```

Read:

```http
GET /api/admin-users
GET /api/admin-users/1
```

Update:

```http
PUT /api/admin-users/1
Content-Type: application/json

{
  "firstName": "Ana Marie",
  "lastName": "Reyes",
  "email": "ana.reyes@cit.edu",
  "position": "Senior Registrar Admin",
  "active": true
}
```

Delete:

```http
DELETE /api/admin-users/1
```

## Main Workflow Endpoints

```http
GET /api/document-requirements
POST /api/document-requests
GET /api/document-requests
PATCH /api/document-requests/{id}/assignment
PATCH /api/document-requests/{id}/status
POST /api/document-requests/{id}/ping-admin
GET /api/document-requests/{id}/notifications
```

Submit request payload:

```json
{
  "studentId": 1,
  "documentId": 1,
  "requestType": "Good Moral Certificate",
  "expectedProcessingTime": 3
}
```

Assign staff payload:

```json
{
  "staffId": 1
}
```

Update status payload:

```json
{
  "status": "PROCESSING"
}
```

Valid statuses are `PENDING`, `IN_REVIEW`, `PROCESSING`, `COMPLETED`, and `REJECTED`.

## Test

```powershell
cd backend
mvn test
```

`AdminUserControllerTest` verifies create, read, update, list, and delete for the admin user increment requirement.
