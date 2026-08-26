Crime Evidence Management System

A secure crime case and evidence management backend built with C#, ASP.NET Core Web API, PostgreSQL, Entity Framework Core, JWT, and Swagger.

Progress
Day	Work	Status
Day 1	Foundation & PostgreSQL Database	✅
Day 2	JWT Authentication	✅
Day 3	Role-Based Access Control	✅
Day 4	Case Management	✅
Day 5	Evidence Management	✅
Crime Evidence Management System

A secure crime case and evidence management backend built with C#, ASP.NET Core Web API, PostgreSQL, Entity Framework Core, JWT, and Swagger.

Progress
Day	Work	Status
Day 1	Foundation & PostgreSQL Database	✅
Day 2	JWT Authentication	✅
Day 3	Role-Based Access Control	✅
Day 4	Case Management	✅
Day 5	Evidence Management	✅

Completed Work
Day 1 — Foundation
ASP.NET Core Web API setup
PostgreSQL database integration
Entity Framework Core
Case and User models
Database migrations
Day 2 — Authentication
User registration and login
BCrypt password hashing
JWT token generation
Protected API authentication
Day 3 — RBAC

Implemented roles:

ADMIN
INVESTIGATING_OFFICER
EVIDENCE_OFFICER
FORENSIC_OFFICER
SENIOR_OFFICER

Role-based endpoint authorization implemented with [Authorize].

Day 4 — Case Management

Implemented:

POST   /api/cases
GET    /api/cases
GET    /api/cases/{id}
PUT    /api/cases/{id}
DELETE /api/cases/{id}
GET    /api/cases/search

Includes validation, duplicate case-number checking, search, and role restrictions.

Day 5 — Evidence Management
Evidence model and Case–Evidence relationship
PostgreSQL migration
Evidence DTOs
CRUD APIs
Evidence validation
Automatic evidence numbers
Search and filtering by name, category, and status

Examples:

GET /api/Evidence?search=Knife
GET /api/Evidence?category=Weapon
GET /api/Evidence?status=Collected

All core Evidence APIs were successfully tested through Swagger.
Day 1 — Foundation
ASP.NET Core Web API setup
PostgreSQL database integration
Entity Framework Core
Case and User models
Database migrations
Day 2 — Authentication
User registration and login
BCrypt password hashing
JWT token generation
Protected API authentication
Day 3 — RBAC

Implemented roles:

ADMIN
INVESTIGATING_OFFICER
EVIDENCE_OFFICER
FORENSIC_OFFICER
SENIOR_OFFICER

Role-based endpoint authorization implemented with [Authorize].

Day 4 — Case Management

Implemented:

POST   /api/cases
GET    /api/cases
GET    /api/cases/{id}
PUT    /api/cases/{id}
DELETE /api/cases/{id}
GET    /api/cases/search

Includes validation, duplicate case-number checking, search, and role restrictions.

Day 5 — Evidence Management
Evidence model and Case–Evidence relationship
PostgreSQL migration
Evidence DTOs
CRUD APIs
Evidence validation
Automatic evidence numbers
Search and filtering by name, category, and status

Examples:

GET /api/Evidence?search=Knife
GET /api/Evidence?category=Weapon
GET /api/Evidence?status=Collected

All core Evidence APIs were successfully tested through Swagger.

Chain of Custody

Implemented a complete Chain of Custody module to maintain a secure audit trail of evidence transfers throughout an investigation.

Features Implemented

Added ChainOfCustody entity with a one-to-many relationship to Evidence.

Created PostgreSQL table using EF Core Migration.

Built Service Layer (IChainOfCustodyService and ChainOfCustodyService) for business logic.

Added request and response DTOs for secure data transfer.

Created protected REST APIs using JWT Authentication and Role-Based Authorization.

Implemented automatic UTC timestamp generation for every custody event.

Added business validations:

Prevent invalid evidence references.

Prevent self-transfers (FromUserId and ToUserId cannot be the same).

Reject empty actions.

Returned proper HTTP status codes (201, 400, 401, 403, 404).

Database Changes

New table: ChainOfCustodies

Column

	

Purpose




Id

	

Primary Key




EvidenceId

	

Foreign Key




FromUserId

	

Previous holder




ToUserId

	

New holder




Action

	

Custody action




Location

	

Transfer location




Notes

	

Additional remarks




Timestamp

	

Auto-generated UTC timestamp

API Endpoints

Method

	

Endpoint

	

Purpose




POST

	

/api/ChainOfCustody

	

Create a custody record




GET

	

/api/ChainOfCustody/{id}

	

Get a single custody record




GET

	

/api/ChainOfCustody/evidence/{evidenceId}

	

Get the complete custody timeline

Testing Completed

201 Created for successful custody creation.

200 OK for timeline and single-record retrieval.

404 Not Found for invalid evidence IDs.

400 Bad Request for validation failures.

401 Unauthorized for requests without JWT.

403 Forbidden for unauthorized roles.

Verified data persistence in PostgreSQL.

Project Structure Added
Models/
 └── ChainOfCustody.cs

DTOs/
 └── ChainOfCustody/
     ├── CreateCustodyDto.cs
     └── CustodyResponseDto.cs

Interfaces/
 └── IChainOfCustodyService.cs

Services/
 └── ChainOfCustodyService.cs

Controllers/
 └── ChainOfCustodyController.cs

