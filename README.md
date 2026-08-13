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
