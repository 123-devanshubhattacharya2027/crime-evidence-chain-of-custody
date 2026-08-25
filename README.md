# Crime Evidence Management System

A secure crime investigation and evidence management backend built with **ASP.NET Core Web API, .NET 10, Entity Framework Core, PostgreSQL, JWT, and Role-Based Authorization**.

##  Project Status

* [x] Day 1 — Backend & Database Foundation
* [x] Day 2 — Authentication + JWT + RBAC
* [x] Day 3 — Case Management APIs
* [ ] Evidence Management
* [ ] Forensic Workflow
* [ ] Audit Logging
* [ ] Frontend Integration

## Tech Stack

* **Backend:** C#, ASP.NET Core Web API, .NET 10
* **Database:** PostgreSQL, Entity Framework Core, Npgsql
* **Security:** JWT, BCrypt, Role-Based Authorization
* **Testing:** Swagger / OpenAPI
* **Tools:** Git, GitHub, VS Code, pgAdmin

##  Day 1 — Backend & Database

* Created ASP.NET Core Web API
* Configured PostgreSQL with EF Core
* Created `ApplicationDbContext`
* Added `Case`, `Evidence`, and `User` models
* Configured EF Core migrations
* Added Swagger API documentation

##  Day 2 — Authentication & Authorization

* User registration and login
* BCrypt password hashing
* JWT token generation and validation
* Protected endpoints using `[Authorize]`
* Role-based authorization

### Roles

```text
ADMIN
INVESTIGATING_OFFICER
EVIDENCE_OFFICER
FORENSIC_OFFICER
SENIOR_OFFICER
```

### Authentication APIs

```text
POST /api/Auth/register
POST /api/Auth/login
```

### Tested

* JWT-protected endpoint → `401` without token
* JWT-protected endpoint → `200` with valid token
* Role authorization → `200/403` based on user role

##  Project Structure

```text
CrimeEvidence.API
├── Controllers
├── Data
├── DTOs
├── Models
├── Migrations
├── Program.cs
└── appsettings.json
```

##  Run Locally

```bash
dotnet restore
dotnet ef database update
dotnet run
```

Swagger:

```text
https://localhost:<PORT>/swagger
```

##  Goal

Build a secure, real-world backend for managing **criminal cases, evidence, investigators, forensic workflows, and role-based access**.

## Day 4 – Case Management (Completed)

Implemented a complete **Case Management** module with Role-Based Access Control (RBAC) using **ASP.NET Core Web API, Entity Framework Core, and PostgreSQL**.

### Features Implemented

- Create crime cases
- View all cases
- View a case by ID
- Search cases by Case Number or Title
- Update case details
- Delete cases (Admin only)
- Swagger API testing completed

### API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/cases` | Admin, Investigating Officer |
| GET | `/api/cases` | Authenticated Users |
| GET | `/api/cases/{id}` | Authenticated Users |
| GET | `/api/cases/search?query=` | Authenticated Users |
| PUT | `/api/cases/{id}` | Admin, Investigating Officer |
| DELETE | `/api/cases/{id}` | Admin |

### Tech Used

- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- Role-Based Authorization
- Swagger/OpenAPI

  Day 5 focused on building the complete Evidence Management module for the Crime Evidence Management System using ASP.NET Core Web API, Entity Framework Core, PostgreSQL, and JWT authentication.

Completed Work
1. Evidence Entity

Created the Evidence model with:

Evidence ID
Evidence Number
Name
Description
Category
Status
Collection Date
Collected By
Storage Location
Case ID
2. Case–Evidence Relationship

Implemented a one-to-many relationship:

Case
 └── Evidence
      ├── Evidence 1
      ├── Evidence 2
      └── Evidence 3

Each evidence record is linked to a specific case using CaseId.

3. Database Integration

Updated ApplicationDbContext and created the EF Core migration:

AddEvidenceTable

The migration was successfully applied to PostgreSQL.

4. Evidence DTOs

Created:

CreateEvidenceDto
UpdateEvidenceDto
EvidenceResponseDto

These DTOs separate API input/output models from the database entity.

5. Evidence API

Implemented the following endpoints:

Method	Endpoint	Description
POST	/api/Evidence	Create evidence
GET	/api/Evidence	Get all evidence
GET	/api/Evidence/{id}	Get evidence by ID
GET	/api/Evidence/case/{caseId}	Get evidence for a case
PUT	/api/Evidence/{id}	Update evidence
DELETE	/api/Evidence/{id}	Delete evidence
6. Validation

Evidence creation verifies that the referenced case exists before saving the evidence record.

Evidence numbers are automatically generated in the format:

EV-2026-0001
EV-2026-0002
EV-2026-0003
7. Search and Filtering

Implemented evidence searching and filtering using query parameters.

Examples:

GET /api/Evidence?search=Knife
GET /api/Evidence?category=Weapon
GET /api/Evidence?status=Collected

Combined filtering is also supported:

GET /api/Evidence?search=Knife&category=Weapon&status=Collected

Search checks evidence name and description.

8. Authentication & Authorization

Evidence APIs are protected using JWT authentication.

Admin authentication and authorization were tested successfully through Swagger.

9. API Testing

The Evidence module was tested through Swagger, including:

Evidence creation
Retrieve all evidence
Retrieve evidence by ID
Retrieve evidence by case
Evidence update
Update verification
Evidence deletion
Delete verification
Search
Category filtering
Status filtering
Combined filtering

All core Evidence Management operations were successfully verified.


