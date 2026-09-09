Crime Evidence Management System
> A secure Crime Evidence Management System built with C#, ASP.NET Core Web API, PostgreSQL, Entity Framework Core, JWT Authentication, and Docker.
Project Overview
This project simulates a real-world digital evidence management platform used by police departments and forensic laboratories. It focuses on secure authentication, role-based access control, complete evidence tracking, and a verifiable chain of custody.
Key Features
JWT Authentication
Role-Based Access Control (RBAC)
Crime Case Management
Evidence Tracking
Chain of Custody
Forensic Examination
Dockerized Deployment
Swagger Documentation
Tech Stack
Technology	Purpose
C# / .NET 8	Backend
ASP.NET Core Web API	REST API
PostgreSQL	Database
Entity Framework Core	ORM
JWT	Authentication
Swagger	API Testing
Docker	Containerization
React (Vite)	Frontend
Development Progress
Day	Module	Status
Day 1	Foundation & Database	✅
Day 2	JWT Authentication	✅
Day 3	RBAC	✅
Day 4	Case Management	✅
Day 5	Evidence Management	✅
Day 6	Chain of Custody	✅
Day 7	Forensic Module	✅
Day 8	React Frontend Setup	✅
Day 9	Docker & Validation	✅
Completed Modules
Day 1 – Foundation & Database
ASP.NET Core Web API setup
PostgreSQL integration
Entity Framework Core configuration
Case and User models
Database migrations
Day 2 – JWT Authentication
User Registration
User Login
BCrypt password hashing
JWT token generation
Protected API authentication
Day 3 – Role-Based Access Control
Supported roles:
ADMIN
INVESTIGATING_OFFICER
EVIDENCE_OFFICER
FORENSIC_OFFICER
SENIOR_OFFICER
Endpoints secured with `[Authorize]`.
Day 4 – Case Management
Method	Endpoint
POST	`/api/cases`
GET	`/api/cases`
GET	`/api/cases/{id}`
PUT	`/api/cases/{id}`
DELETE	`/api/cases/{id}`
GET	`/api/cases/search`
Features:
Create and update cases
Search functionality
Duplicate case-number validation
Role restrictions
Day 5 – Evidence Management
Evidence model
Case–Evidence relationship
CRUD APIs
Automatic evidence numbering
Search and filtering
Example:
```http
GET /api/Evidence?search=Knife
GET /api/Evidence?category=Weapon
GET /api/Evidence?status=Collected
```
Day 6 – Chain of Custody
Features:
ChainOfCustody entity
Service layer
DTOs
JWT protection
Automatic UTC timestamps
Endpoints:
Method	Endpoint
POST	`/api/ChainOfCustody`
GET	`/api/ChainOfCustody/{id}`
GET	`/api/ChainOfCustody/evidence/{evidenceId}`
Validation tested:
201 Created
200 OK
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
Day 7 – Forensic Module
Features:
Create forensic examinations
Update records
Upload documents
Retrieve documents
Endpoints:
Method	Endpoint
POST	`/api/Forensic`
GET	`/api/Forensic/{id}`
GET	`/api/Forensic/evidence/{evidenceId}`
PUT	`/api/Forensic/{id}`
POST	`/api/Forensic/documents/upload`
GET	`/api/Forensic/{id}/documents`
Day 8 – React Frontend Setup
React + Vite setup
Initial dashboard structure
Frontend integrated into repository
Day 9 – Docker Support & Validation
Features:
Multi-stage Dockerfile
`.dockerignore`
Docker image creation
Docker Compose support
Port mapping (5087 → 8080)
Commands:
```bash
docker build -t crime-evidence-api .
docker run -d --name crime-api -p 5087:8080 crime-evidence-api
docker ps
docker images
```
Project Structure
```text
CrimeEvidenceSystem/
├── backend/
│   └── CrimeEvidence.API/
│       ├── Controllers/
│       ├── DTOs/
│       ├── Models/
│       ├── Services/
│       ├── Interfaces/
│       ├── Filters/
│       ├── Middleware/
│       ├── Dockerfile
│       └── .dockerignore
├── frontend/
└── docker-compose.yml
```
Running Locally
Docker
```bash
docker build -t crime-evidence-api .
docker run -d --name crime-api -p 5087:8080 crime-evidence-api
```
Swagger:
```text
http://localhost:5087/swagger
```
.NET CLI
```bash
dotnet restore
dotnet build
dotnet run
```

