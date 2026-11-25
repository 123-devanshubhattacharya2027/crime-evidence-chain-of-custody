
using CrimeEvidence.API.Constants;
using CrimeEvidence.API.Data;
using CrimeEvidence.API.DTOs.Evidence;
using CrimeEvidence.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CrimeEvidence.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EvidenceController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly EvidenceFileService _fileService;

    public EvidenceController(
        ApplicationDbContext context,
        EvidenceFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    // POST: api/evidence
    [HttpPost]
    [Authorize(Roles =
        Roles.Admin + "," +
        Roles.SeniorOfficer + "," +
        Roles.InvestigatingOfficer + "," +
        Roles.EvidenceOfficer)]
    public async Task<ActionResult<EvidenceResponseDto>> CreateEvidence(
        [FromBody] CreateEvidenceDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdValue, out int userId))
            return Unauthorized("Invalid officer identity.");

        var officer = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (officer == null)
            return Unauthorized("Officer account not found.");

        var caseExists = await _context.Cases
            .AnyAsync(c => c.CaseId == dto.CaseId);

        if (!caseExists)
            return BadRequest("The specified case does not exist.");

        var evidenceCount = await _context.Evidences.CountAsync();

        var evidence = new Models.Evidence
        {
            EvidenceNumber =
                $"EV-{DateTime.UtcNow.Year}-{evidenceCount + 1:D4}",

            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            CollectedBy = officer.FullName,
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
            CaseId = evidence.CaseId,

            HasFile = !string.IsNullOrWhiteSpace(evidence.FilePath),
            FileName = evidence.FileName,
            FileSize = evidence.FileSize,
            UploadedAt = evidence.UploadedAt
        };

        return CreatedAtAction(
            nameof(GetEvidenceById),
            new { id = evidence.Id },
            response);
    }

    // GET: api/evidence
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EvidenceResponseDto>>> GetEvidence(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? status)
    {
        var query = _context.Evidences
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(e =>
                e.Name.Contains(search) ||
                e.Description.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(e => e.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(e => e.Status == status);
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
                CaseId = e.CaseId,

                HasFile = e.FilePath != null,
                FileName = e.FileName,
                FileSize = e.FileSize,
                UploadedAt = e.UploadedAt
            })
            .ToListAsync();

        return Ok(evidence);
    }

    // GET: api/evidence/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<EvidenceResponseDto>> GetEvidenceById(
        int id)
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
                CaseId = e.CaseId,

                HasFile = e.FilePath != null,
                FileName = e.FileName,
                FileSize = e.FileSize,
                UploadedAt = e.UploadedAt
            })
            .FirstOrDefaultAsync();

        if (evidence == null)
            return NotFound("Evidence not found.");

        return Ok(evidence);
    }

    // GET: api/evidence/case/1
    [HttpGet("case/{caseId:int}")]
    public async Task<ActionResult<IEnumerable<EvidenceResponseDto>>>
        GetEvidenceByCase(int caseId)
    {
        var caseExists = await _context.Cases
            .AnyAsync(c => c.CaseId == caseId);

        if (!caseExists)
            return NotFound("Case not found.");

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
                CaseId = e.CaseId,

                HasFile = e.FilePath != null,
                FileName = e.FileName,
                FileSize = e.FileSize,
                UploadedAt = e.UploadedAt
            })
            .ToListAsync();

        return Ok(evidence);
    }

    // POST: api/evidence/upload
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(11 * 1024 * 1024)]
    [Authorize(Roles =
        Roles.Admin + "," +
        Roles.SeniorOfficer + "," +
        Roles.InvestigatingOfficer + "," +
        Roles.EvidenceOfficer)]
    public async Task<ActionResult<EvidenceResponseDto>> UploadEvidence(
        [FromForm] UploadEvidenceRequest request)
    {
        if (request.File == null || request.File.Length == 0)
            return BadRequest("Please select a file.");

        if (request.CaseId <= 0)
            return BadRequest("Valid Case ID is required.");

        if (string.IsNullOrWhiteSpace(request.EvidenceId))
            return BadRequest("Evidence ID is required.");

        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdValue, out int userId))
            return Unauthorized("Invalid uploader identity.");

        try
        {
            var evidence = await _fileService.UploadAsync(
                request.File,
                request.CaseId,
                request.EvidenceId,
                userId);

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
                CaseId = evidence.CaseId,

                HasFile = true,
                FileName = evidence.FileName,
                FileSize = evidence.FileSize,
                UploadedAt = evidence.UploadedAt
            };

            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (DbUpdateException)
        {
            return Conflict(new
            {
                message = "The evidence file could not be saved. Please try again."
            });
        }
    }

    // GET: api/evidence/1/file
    // Authenticated file download.
    [HttpGet("{id:int}/file")]
    public async Task<IActionResult> DownloadEvidenceFile(int id)
    {
        try
        {
            var result = await _fileService.DownloadAsync(id);

            if (result == null)
                return NotFound("Evidence or attached file not found.");

            return File(
                result.Value.Stream,
                result.Value.ContentType,
                result.Value.FileName);
        }
        catch (FileNotFoundException)
        {
            return NotFound("Evidence file is missing from storage.");
        }
        catch (InvalidOperationException)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message = "Invalid evidence storage configuration."
                });
        }
    }

    // PUT: api/evidence/1
    [HttpPut("{id:int}")]
    [Authorize(Roles =
        Roles.Admin + "," +
        Roles.SeniorOfficer + "," +
        Roles.EvidenceOfficer)]
    public async Task<IActionResult> UpdateEvidence(
        int id,
        [FromBody] UpdateEvidenceDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var evidence = await _context.Evidences
            .FirstOrDefaultAsync(e => e.Id == id);

        if (evidence == null)
            return NotFound("Evidence not found.");

        evidence.Name = dto.Name;
        evidence.Description = dto.Description;
        evidence.Category = dto.Category;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/evidence/1
    // Permanent deletion is disabled to preserve forensic records.
    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public IActionResult DeleteEvidence(int id)
    {
        return StatusCode(
            StatusCodes.Status405MethodNotAllowed,
            new
            {
                message = "Permanent evidence deletion is disabled to preserve chain-of-custody records."
            });
    }
}
