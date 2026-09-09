Crime Evidence Management System

A secure Crime Evidence Management Backend built with C#, ASP.NET Core Web API, PostgreSQL, Entity Framework Core, JWT Authentication, and Docker. The system enables law enforcement agencies to manage crime cases, evidence, chain of custody records, and forensic examinations through a secure REST API.

Project Overview

This project simulates a real-world digital evidence management platform used by police departments and forensic laboratories. It focuses on secure authentication, role-based access control, complete evidence tracking, and a verifiable chain of custody.

Tech Stack

C# / .NET 8

PostgreSQL

Entity Framework Core

JWT Authentication

Swagger

Docker

Project Architecture
Development Progress

Day

	

Module

	

Status




Day 1

	

Foundation & Database

	

✅




Day 2

	

JWT Authentication

	

✅




Day 3

	

Role-Based Access Control

	

✅




Day 4

	

Case Management

	

✅




Day 5

	

Evidence Management

	

✅




Day 6

	

Chain of Custody

	

✅




Day 7

	

Forensic Module

	

✅




Day 8

	

React Frontend Setup

	

✅




Day 9

	

Docker & Validation

	

✅

Completed Modules
Day 1 — Foundation & Database

Established the backend foundation.

Implemented

ASP.NET Core Web API setup

PostgreSQL integration

Entity Framework Core

Case and User models

Database migrations

Outcome

A working backend connected to PostgreSQL with persistent data storage.

Day 2 — JWT Authentication

Implemented secure user authentication.

Features

User Registration

User Login

BCrypt password hashing

JWT token generation

Protected API authentication

Day 3 — Role-Based Access Control

Implemented authorization for different police personnel.

Roles

ADMIN

INVESTIGATING_OFFICER

EVIDENCE_OFFICER

FORENSIC_OFFICER

SENIOR_OFFICER

Used ASP.NET Core's [Authorize] attribute to secure endpoints based on user roles.

Day 4 — Case Management

Implemented complete crime case management.

Endpoints

Method

	

Endpoint




POST

	

/api/cases




GET

	

/api/cases




GET

	

/api/cases/{id}




PUT

	

/api/cases/{id}




DELETE

	

/api/cases/{id}




GET

	

/api/cases/search

Features

Case creation

Updates

Search functionality

Duplicate case-number validation

Role restrictions

Day 5 — Evidence Management

Implemented complete evidence management.

Features

Evidence model

Case–Evidence relationship

PostgreSQL migration

Evidence DTOs

CRUD APIs

Automatic evidence numbering

Validation

Search and filtering

Example Requests
GET /api/Evidence?search=Knife
GET /api/Evidence?category=Weapon
GET /api/Evidence?status=Collected

All evidence APIs were successfully verified using Swagger.

Day 6 — Chain of Custody

Implemented a complete audit trail for evidence transfers.

Features

ChainOfCustody entity

One-to-many relationship with Evidence

EF Core migration

Service layer

DTOs

JWT protection

Role authorization

Automatic UTC timestamps

Business Rules

Invalid evidence IDs rejected

Self-transfers prevented

Empty actions rejected

Proper HTTP responses returned

Database Table

Column

	

Purpose




Id

	

Primary Key




EvidenceId

	

Foreign Key




FromUserId

	

Previous Holder




ToUserId

	

New Holder




Action

	

Custody Action




Location

	

Transfer Location




Notes

	

Additional Remarks




Timestamp

	

Auto-generated UTC Time

API Endpoints

Method

	

Endpoint




POST

	

/api/ChainOfCustody




GET

	

/api/ChainOfCustody/{id}




GET

	

/api/ChainOfCustody/evidence/{evidenceId}

Validation Tested

201 Created

200 OK

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

Project Structure
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
Day 7 — Forensic Examination Module

Implemented forensic examination and document management.

Features

Create forensic examinations

Update examination records

Upload forensic documents

Retrieve uploaded documents

JWT-secured endpoints

Endpoints

Method

	

Endpoint




POST

	

/api/Forensic




GET

	

/api/Forensic/{id}




GET

	

/api/Forensic/evidence/{evidenceId}




PUT

	

/api/Forensic/{id}




POST

	

/api/Forensic/documents/upload




GET

	

/api/Forensic/{id}/documents

All endpoints were verified through Swagger.

Day 8 — React Frontend Setup

Prepared the frontend foundation using React and Vite.

Setup Completed

React project initialized

Vite configuration

Project structure

Initial dashboard setup

Frontend integrated into repository

Day 9 — Docker Support & Validation

Containerized the backend for consistent deployment.

Docker Features

Multi-stage Dockerfile

.dockerignore

Docker image creation

Container deployment

Port mapping

Docker Compose support

Swagger verification inside Docker

Dockerfile Highlights

.NET 8 SDK build stage

ASP.NET Runtime stage

Optimized production image

Published application copied into runtime image

Docker Commands
docker build -t crime-evidence-api .
docker run -d --name crime-api -p 5087:8080 crime-evidence-api
docker ps
docker images
Docker Workflow

The API runs inside a Docker container on localhost:5087, while the application listens internally on port 8080.

API Documentation

Swagger UI is available during local development.

http://localhost:5087/swagger
Project Structure
CrimeEvidenceSystem/
│
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
│
├── frontend/
│
└── docker-compose.yml

