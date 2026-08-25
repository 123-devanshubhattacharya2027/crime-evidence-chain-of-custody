using CrimeEvidence.API.Data;
using CrimeEvidence.API.DTOs.Evidence;
using CrimeEvidence.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrimeEvidence.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EvidenceController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EvidenceController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/evidence
    [HttpPost]
    public async Task<ActionResult<EvidenceResponseDto>> CreateEvidence(
        CreateEvidenceDto dto)
    {
        // Check whether the case exists
        var caseExists = await _context.Cases
            .AnyAsync(c => c.CaseId == dto.CaseId);

        if (!caseExists)
        {
            return BadRequest("The specified case does not exist.");
        }

        // Generate evidence number
        var evidenceCount = await _context.Evidences.CountAsync();

        var evidence = new Evidence
        {
            EvidenceNumber =
                $"EV-{DateTime.UtcNow.Year}-{evidenceCount + 1:D4}",

            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            CollectedBy = dto.CollectedBy,
            StorageLocation = dto.StorageLocation,
            CaseId = dto.CaseId,
            Status = "Collected",
            CollectedAt = DateTime.UtcNow
        };

        _context.Evidences.Add(evidence);

        await _context.SaveChangesAsync();

        var response = new EvidenceResponseDto
        {
            Id = evidence.Id,
            EvidenceNumber = evidence.EvidenceNumber,
            Name = evidence.Name,
            Description = evidence.Description,
            Category = evidence.Category,
            Status = evidence.Status,
            CollectedAt = evidence.CollectedAt,
            CollectedBy = evidence.CollectedBy,
            StorageLocation = evidence.StorageLocation,
            CaseId = evidence.CaseId
        };

        return CreatedAtAction(
            nameof(GetEvidenceById),
            new { id = evidence.Id },
            response);
    }

    // GET: api/evidence
    // Examples:
    // GET /api/evidence
    // GET /api/evidence?search=Knife
    // GET /api/evidence?category=Weapon
    // GET /api/evidence?status=Under%20Examination
    // GET /api/evidence?search=Knife&category=Weapon
    // GET /api/evidence?search=Knife&category=Weapon&status=Under%20Examination

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EvidenceResponseDto>>> GetEvidence(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? status)
    {
        var query = _context.Evidences
            .AsNoTracking()
            .AsQueryable();

        // Search by evidence name or description
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(e =>
                e.Name.Contains(search) ||
                e.Description.Contains(search));
        }

        // Filter by category
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(e =>
                e.Category == category);
        }

        // Filter by status
        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(e =>
                e.Status == status);
        }

        var evidence = await query
            .Select(e => new EvidenceResponseDto
            {
                Id = e.Id,
                EvidenceNumber = e.EvidenceNumber,
                Name = e.Name,
                Description = e.Description,
                Category = e.Category,
                Status = e.Status,
                CollectedAt = e.CollectedAt,
                CollectedBy = e.CollectedBy,
                StorageLocation = e.StorageLocation,
                CaseId = e.CaseId
            })
            .ToListAsync();

        return Ok(evidence);
    }

    // GET: api/evidence/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<EvidenceResponseDto>> GetEvidenceById(int id)
    {
        var evidence = await _context.Evidences
            .AsNoTracking()
            .Where(e => e.Id == id)
            .Select(e => new EvidenceResponseDto
            {
                Id = e.Id,
                EvidenceNumber = e.EvidenceNumber,
                Name = e.Name,
                Description = e.Description,
                Category = e.Category,
                Status = e.Status,
                CollectedAt = e.CollectedAt,
                CollectedBy = e.CollectedBy,
                StorageLocation = e.StorageLocation,
                CaseId = e.CaseId
            })
            .FirstOrDefaultAsync();

        if (evidence == null)
        {
            return NotFound("Evidence not found.");
        }

        return Ok(evidence);
    }

    // GET: api/evidence/case/1
    [HttpGet("case/{caseId:int}")]
    public async Task<ActionResult<IEnumerable<EvidenceResponseDto>>> GetEvidenceByCase(
        int caseId)
    {
        var caseExists = await _context.Cases
            .AnyAsync(c => c.CaseId == caseId);

        if (!caseExists)
        {
            return NotFound("Case not found.");
        }

        var evidence = await _context.Evidences
            .AsNoTracking()
            .Where(e => e.CaseId == caseId)
            .Select(e => new EvidenceResponseDto
            {
                Id = e.Id,
                EvidenceNumber = e.EvidenceNumber,
                Name = e.Name,
                Description = e.Description,
                Category = e.Category,
                Status = e.Status,
                CollectedAt = e.CollectedAt,
                CollectedBy = e.CollectedBy,
                StorageLocation = e.StorageLocation,
                CaseId = e.CaseId
            })
            .ToListAsync();

        return Ok(evidence);
    }

    // PUT: api/evidence/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateEvidence(
        int id,
        UpdateEvidenceDto dto)
    {
        var evidence = await _context.Evidences
            .FirstOrDefaultAsync(e => e.Id == id);

        if (evidence == null)
        {
            return NotFound("Evidence not found.");
        }

        evidence.Name = dto.Name;
        evidence.Description = dto.Description;
        evidence.Category = dto.Category;
        evidence.Status = dto.Status;
        evidence.StorageLocation = dto.StorageLocation;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/evidence/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteEvidence(int id)
    {
        var evidence = await _context.Evidences
            .FirstOrDefaultAsync(e => e.Id == id);

        if (evidence == null)
        {
            return NotFound("Evidence not found.");
        }

        _context.Evidences.Remove(evidence);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}