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



