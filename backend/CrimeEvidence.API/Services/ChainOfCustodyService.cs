
using CrimeEvidence.API.Constants;
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

        // Create a new custody transfer
        public async Task<CustodyResponseDto?> CreateCustodyAsync(
            CreateCustodyDto dto,
            int fromUserId)
        {
            // 1. Verify evidence exists
            var evidence = await _context.Evidences
                .FindAsync(dto.EvidenceId);

            if (evidence == null)
                return null;

            // 2. Verify authenticated sender exists
            var sender = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == fromUserId);

            if (sender == null)
                throw new ArgumentException(
                    "Authenticated sender not found.");

            // 3. Verify recipient exists
            var recipient = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == dto.ToUserId);

            if (recipient == null)
                throw new ArgumentException(
                    "Recipient user not found.");

            // 4. Prevent self-transfer
            if (fromUserId == dto.ToUserId)
                throw new ArgumentException(
                    "You cannot transfer evidence to yourself.");

            // 5. Validate recipient role
            var allowedRoles = new[]
            {
                Roles.Admin,
                Roles.SeniorOfficer,
                Roles.InvestigatingOfficer,
                Roles.EvidenceOfficer,
                Roles.ForensicOfficer
            };

            if (!allowedRoles.Contains(recipient.Role))
                throw new ArgumentException(
                    "Recipient does not have an authorized officer role.");

            // 6. Validate action
            if (string.IsNullOrWhiteSpace(dto.Action))
                throw new ArgumentException(
                    "Action is required.");

            // 7. Normalize location
            var newLocation = dto.Location?.Trim();

            // 8. Synchronize current evidence location
            if (!string.IsNullOrWhiteSpace(newLocation))
            {
                evidence.StorageLocation = newLocation;
            }

            // Evidence status is deliberately not changed.

            // 9. Create permanent custody record
            var custody = new ChainOfCustody
            {
                EvidenceId = dto.EvidenceId,
                FromUserId = sender.Id,
                ToUserId = recipient.Id,
                Action = dto.Action.Trim(),
                Location = newLocation,
                Notes = dto.Notes?.Trim(),
                Timestamp = DateTime.UtcNow
            };

            _context.ChainOfCustodies.Add(custody);

            // Save custody and evidence location together
            await _context.SaveChangesAsync();

            // 10. Return custody record with officer names
            return new CustodyResponseDto
            {
                Id = custody.Id,
                EvidenceId = custody.EvidenceId,
                FromUserId = custody.FromUserId,
                FromUserName = sender.FullName,
                ToUserId = custody.ToUserId,
                ToUserName = recipient.FullName,
                Action = custody.Action,
                Location = custody.Location,
                Notes = custody.Notes,
                Timestamp = custody.Timestamp
            };
        }

        // Get complete evidence custody timeline
        public async Task<List<CustodyResponseDto>> GetEvidenceTimelineAsync(
            int evidenceId)
        {
            // 1. Verify evidence exists
            var evidenceExists = await _context.Evidences
                .AsNoTracking()
                .AnyAsync(e => e.Id == evidenceId);

            if (!evidenceExists)
                throw new KeyNotFoundException(
                    "Evidence not found.");

            // 2. Retrieve chronological custody history
            return await _context.ChainOfCustodies
                .AsNoTracking()
                .Where(c => c.EvidenceId == evidenceId)
                .OrderBy(c => c.Timestamp)
                .ThenBy(c => c.Id)
                .Select(c => new CustodyResponseDto
                {
                    Id = c.Id,
                    EvidenceId = c.EvidenceId,

                    FromUserId = c.FromUserId,
                    FromUserName = _context.Users
                        .Where(u => u.Id == c.FromUserId)
                        .Select(u => u.FullName)
                        .FirstOrDefault(),

                    ToUserId = c.ToUserId,
                    ToUserName = _context.Users
                        .Where(u => u.Id == c.ToUserId)
                        .Select(u => u.FullName)
                        .FirstOrDefault(),

                    Action = c.Action,
                    Location = c.Location,
                    Notes = c.Notes,
                    Timestamp = c.Timestamp
                })
                .ToListAsync();
        }

        // Get custody record by ID
        public async Task<CustodyResponseDto?> GetByIdAsync(int id)
        {
            var custody = await _context.ChainOfCustodies
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (custody == null)
                return null;

            var sender = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == custody.FromUserId);

            var recipient = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == custody.ToUserId);

            return new CustodyResponseDto
            {
                Id = custody.Id,
                EvidenceId = custody.EvidenceId,
                FromUserId = custody.FromUserId,
                FromUserName = sender?.FullName,
                ToUserId = custody.ToUserId,
                ToUserName = recipient?.FullName,
                Action = custody.Action,
                Location = custody.Location,
                Notes = custody.Notes,
                Timestamp = custody.Timestamp
            };
        }
    }
}
