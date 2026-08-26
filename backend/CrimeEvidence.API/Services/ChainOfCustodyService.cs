using CrimeEvidence.API.Data;
using CrimeEvidence.API.DTOs.ChainOfCustody;
using CrimeEvidence.API.Interfaces;
using CrimeEvidence.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CrimeEvidence.API.Services
{
    public class ChainOfCustodyService : IChainOfCustodyService
    {
        private readonly ApplicationDbContext _context;

        public ChainOfCustodyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CustodyResponseDto?> CreateCustodyAsync(CreateCustodyDto dto)
        {
            // Check if the evidence exists
            var evidence = await _context.Evidences.FindAsync(dto.EvidenceId);

            if (evidence == null)
                return null;

            // Business Rule: FromUser and ToUser cannot be the same
            if (dto.FromUserId == dto.ToUserId)
                throw new ArgumentException("FromUserId and ToUserId cannot be the same.");

            // Business Rule: Action cannot be empty
            if (string.IsNullOrWhiteSpace(dto.Action))
                throw new ArgumentException("Action is required.");

            var custody = new ChainOfCustody
            {
                EvidenceId = dto.EvidenceId,
                FromUserId = dto.FromUserId,
                ToUserId = dto.ToUserId,
                Action = dto.Action.Trim(),
                Location = dto.Location,
                Notes = dto.Notes,
                Timestamp = DateTime.UtcNow
            };

            _context.ChainOfCustodies.Add(custody);
            await _context.SaveChangesAsync();

            return new CustodyResponseDto
            {
                Id = custody.Id,
                EvidenceId = custody.EvidenceId,
                FromUserId = custody.FromUserId,
                ToUserId = custody.ToUserId,
                Action = custody.Action,
                Location = custody.Location,
                Notes = custody.Notes,
                Timestamp = custody.Timestamp
            };
        }

        public async Task<List<CustodyResponseDto>> GetEvidenceTimelineAsync(int evidenceId)
        {
            return await _context.ChainOfCustodies
                .Where(c => c.EvidenceId == evidenceId)
                .OrderBy(c => c.Timestamp)
                .Select(c => new CustodyResponseDto
                {
                    Id = c.Id,
                    EvidenceId = c.EvidenceId,
                    FromUserId = c.FromUserId,
                    ToUserId = c.ToUserId,
                    Action = c.Action,
                    Location = c.Location,
                    Notes = c.Notes,
                    Timestamp = c.Timestamp
                })
                .ToListAsync();
        }

        public async Task<CustodyResponseDto?> GetByIdAsync(int id)
        {
            var custody = await _context.ChainOfCustodies.FindAsync(id);

            if (custody == null)
                return null;

            return new CustodyResponseDto
            {
                Id = custody.Id,
                EvidenceId = custody.EvidenceId,
                FromUserId = custody.FromUserId,
                ToUserId = custody.ToUserId,
                Action = custody.Action,
                Location = custody.Location,
                Notes = custody.Notes,
                Timestamp = custody.Timestamp
            };
        }
    }
}