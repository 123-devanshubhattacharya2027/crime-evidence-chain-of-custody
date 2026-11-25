
using CrimeEvidence.API.Constants;
using CrimeEvidence.API.Data;
using CrimeEvidence.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrimeEvidence.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Cases
        [HttpGet]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.InvestigatingOfficer + "," +
            Roles.EvidenceOfficer + "," +
            Roles.ForensicOfficer)]
        public async Task<IActionResult> GetCases()
        {
            var cases = await _context.Cases
                .OrderByDescending(c => c.CaseId)
                .Select(c => new
                {
                    id = c.CaseId,
                    caseNumber = c.CaseNumber,
                    title = c.Title,
                    description = c.Description,
                    status = c.Status,
                    createdAt = c.CreatedAt,
                    evidenceCount = c.Evidences.Count
                })
                .ToListAsync();

            return Ok(cases);
        }

        // GET: api/Cases/5
        [HttpGet("{id}")]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.InvestigatingOfficer + "," +
            Roles.EvidenceOfficer + "," +
            Roles.ForensicOfficer)]
        public async Task<IActionResult> GetCase(int id)
        {
            var crimeCase = await _context.Cases
                .Where(c => c.CaseId == id)
                .Select(c => new
                {
                    id = c.CaseId,
                    caseNumber = c.CaseNumber,
                    title = c.Title,
                    description = c.Description,
                    status = c.Status,
                    createdAt = c.CreatedAt,
                    evidences = c.Evidences.Select(e => new
                    {
                        id = e.Id,
                        evidenceNumber = e.EvidenceNumber,
                        name = e.Name,
                        category = e.Category,
                        status = e.Status,
                        storageLocation = e.StorageLocation
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (crimeCase == null)
                return NotFound();

            return Ok(crimeCase);
        }

        // GET: api/Cases/search?query=theft
        [HttpGet("search")]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.InvestigatingOfficer + "," +
            Roles.EvidenceOfficer + "," +
            Roles.ForensicOfficer)]
        public async Task<IActionResult> SearchCases(
            [FromQuery] string query = "")
        {
            var casesQuery = _context.Cases.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                casesQuery = casesQuery.Where(c =>
                    c.Title.Contains(query) ||
                    c.CaseNumber.Contains(query) ||
                    c.Status.Contains(query));
            }

            var results = await casesQuery
                .OrderByDescending(c => c.CaseId)
                .Select(c => new
                {
                    id = c.CaseId,
                    caseNumber = c.CaseNumber,
                    title = c.Title,
                    status = c.Status,
                    createdAt = c.CreatedAt
                })
                .ToListAsync();

            return Ok(results);
        }

        // POST: api/Cases
        [HttpPost]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.InvestigatingOfficer)]
        public async Task<IActionResult> CreateCase(
            [FromBody] Case crimeCase)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Do not allow clients to assign database-generated IDs.
            if (crimeCase.CaseId != 0)
                return BadRequest(new
                {
                    message = "CaseId must not be supplied when creating a case."
                });

            _context.Cases.Add(crimeCase);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCase),
                new { id = crimeCase.CaseId },
                new
                {
                    id = crimeCase.CaseId,
                    caseNumber = crimeCase.CaseNumber,
                    title = crimeCase.Title,
                    status = crimeCase.Status,
                    createdAt = crimeCase.CreatedAt
                });
        }

        // PUT: api/Cases/5
        [HttpPut("{id}")]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.InvestigatingOfficer)]
        public async Task<IActionResult> UpdateCase(
            int id,
            [FromBody] Case updatedCase)
        {
            if (id != updatedCase.CaseId)
                return BadRequest(new
                {
                    message = "Route ID and CaseId do not match."
                });

            var existingCase = await _context.Cases
                .FirstOrDefaultAsync(c => c.CaseId == id);

            if (existingCase == null)
                return NotFound();

            // Update only editable case fields.
            // Preserve the existing database ID and CreatedAt.
            existingCase.CaseNumber = updatedCase.CaseNumber;
            existingCase.Title = updatedCase.Title;
            existingCase.Description = updatedCase.Description;
            existingCase.CrimeType = updatedCase.CrimeType;
            existingCase.Location = updatedCase.Location;
            existingCase.IncidentDate = updatedCase.IncidentDate;
            existingCase.Status = updatedCase.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Cases/5
        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult DeleteCase(int id)
        {
            return StatusCode(
                StatusCodes.Status405MethodNotAllowed,
                new
                {
                    message = "Permanent case deletion is disabled to preserve evidence and audit records."
                });
        }
    }
}
