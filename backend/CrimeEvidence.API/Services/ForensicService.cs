using Microsoft.EntityFrameworkCore;
using CrimeEvidence.API.Data;
using CrimeEvidence.API.DTOs.Forensic;
using CrimeEvidence.API.Interfaces;
using CrimeEvidence.API.Models;
using Microsoft.AspNetCore.Hosting;

namespace CrimeEvidence.API.Services
{
    public class ForensicService : IForensicService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ForensicService(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<ForensicResponseDto> CreateExaminationAsync(CreateForensicDto dto, string examinerId)
        {
            var evidence = await _context.Evidences.FindAsync(dto.EvidenceId);

            if (evidence == null)
                throw new Exception("Evidence not found.");

            var examination = new ForensicExamination
            {
                EvidenceId = dto.EvidenceId,
                ExaminerId = examinerId,
                ExaminationType = dto.ExaminationType,
                Findings = dto.Findings,
                ReportPath = dto.ReportPath,
                Status = "Pending",
                StartedAt = DateTime.UtcNow
            };

            _context.ForensicExaminations.Add(examination);
            await _context.SaveChangesAsync();

            return MapToDto(examination);
        }

        // NEW - Get all examinations
        public async Task<IEnumerable<ForensicResponseDto>> GetAllExaminationsAsync()
        {
            return await _context.ForensicExaminations
                .OrderByDescending(f => f.StartedAt)
                .Select(f => new ForensicResponseDto
                {
                    Id = f.Id,
                    EvidenceId = f.EvidenceId,
                    ExaminerId = f.ExaminerId,
                    ExaminationType = f.ExaminationType,
                    Findings = f.Findings,
                    Status = f.Status,
                    ReportPath = f.ReportPath,
                    StartedAt = f.StartedAt,
                    CompletedAt = f.CompletedAt
                })
                .ToListAsync();
        }

        public async Task<ForensicResponseDto?> GetByIdAsync(int id)
        {
            var examination = await _context.ForensicExaminations
                .FirstOrDefaultAsync(f => f.Id == id);

            if (examination == null)
                return null;

            return MapToDto(examination);
        }

        public async Task<IEnumerable<ForensicResponseDto>> GetByEvidenceAsync(int evidenceId)
        {
            return await _context.ForensicExaminations
                .Where(f => f.EvidenceId == evidenceId)
                .Select(f => new ForensicResponseDto
                {
                    Id = f.Id,
                    EvidenceId = f.EvidenceId,
                    ExaminerId = f.ExaminerId,
                    ExaminationType = f.ExaminationType,
                    Findings = f.Findings,
                    Status = f.Status,
                    ReportPath = f.ReportPath,
                    StartedAt = f.StartedAt,
                    CompletedAt = f.CompletedAt
                })
                .ToListAsync();
        }

        public async Task<ForensicResponseDto?> UpdateExaminationAsync(int id, UpdateForensicDto dto)
        {
            var examination = await _context.ForensicExaminations.FindAsync(id);

            if (examination == null)
                return null;

            examination.Findings = dto.Findings;
            examination.ReportPath = dto.ReportPath;
            examination.Status = dto.Status;

            // Mark completion automatically
            if (dto.Status == "Completed")
                examination.CompletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToDto(examination);
        }

        public async Task<ForensicDocumentDto> UploadDocumentAsync(UploadForensicDocumentDto dto)
        {
            var uploadFolder = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads");

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{dto.File.FileName}";
            var filePath = Path.Combine(uploadFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            var document = new ForensicDocument
            {
                FileName = dto.File.FileName,
                FilePath = filePath,
                FileType = dto.File.ContentType,
                ForensicExaminationId = dto.ForensicExaminationId
            };

            _context.ForensicDocuments.Add(document);
            await _context.SaveChangesAsync();

            return new ForensicDocumentDto
            {
                Id = document.Id,
                FileName = document.FileName,
                FileType = document.FileType,
                UploadedAt = document.UploadedAt
            };
        }

        public async Task<List<ForensicDocumentDto>> GetDocumentsAsync(int forensicExaminationId)
        {
            return await _context.ForensicDocuments
                .Where(d => d.ForensicExaminationId == forensicExaminationId)
                .Select(d => new ForensicDocumentDto
                {
                    Id = d.Id,
                    FileName = d.FileName,
                    FileType = d.FileType,
                    UploadedAt = d.UploadedAt
                })
                .ToListAsync();
        }

        private static ForensicResponseDto MapToDto(ForensicExamination examination)
        {
            return new ForensicResponseDto
            {
                Id = examination.Id,
                EvidenceId = examination.EvidenceId,
                ExaminerId = examination.ExaminerId,
                ExaminationType = examination.ExaminationType,
                Findings = examination.Findings,
                Status = examination.Status,
                ReportPath = examination.ReportPath,
                StartedAt = examination.StartedAt,
                CompletedAt = examination.CompletedAt
            };
        }
    }
}