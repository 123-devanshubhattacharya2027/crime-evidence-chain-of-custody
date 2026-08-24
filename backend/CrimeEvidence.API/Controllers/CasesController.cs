using CrimeEvidence.API.Constants;
using CrimeEvidence.API.Data;
using CrimeEvidence.API.DTOs.Cases;
using CrimeEvidence.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrimeEvidence.API.Controllers;

[ApiController]
[Route("api/cases")]
[Authorize]
public class CasesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CasesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Create a new case
    [HttpPost]
    [Authorize(Roles = Roles.Admin + "," + Roles.InvestigatingOfficer)]
    public async Task<IActionResult> CreateCase([FromBody] CreateCaseRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        bool exists = await _context.Cases
            .AnyAsync(c => c.CaseNumber == request.CaseNumber);

        if (exists)
            return BadRequest("Case number already exists.");

        var crimeCase = new Case
        {
            CaseNumber = request.CaseNumber,
            Title = request.Title,
            Description = request.Description,
            CrimeType = request.CrimeType,
            Location = request.Location,

            // FIX: Convert to UTC for PostgreSQL
            IncidentDate = DateTime.SpecifyKind(request.IncidentDate, DateTimeKind.Utc),

            Status = "Open"
        };

        _context.Cases.Add(crimeCase);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCase), new { id = crimeCase.CaseId }, crimeCase);
    }

    // Get all cases
    [HttpGet]
    public async Task<IActionResult> GetAllCases()
    {
        var cases = await _context.Cases
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return Ok(cases);
    }

    // Get a case by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCase(int id)
    {
        var crimeCase = await _context.Cases.FindAsync(id);

        if (crimeCase == null)
            return NotFound("Case not found.");

        return Ok(crimeCase);
    }

    // Update a case
    [HttpPut("{id}")]
    [Authorize(Roles = Roles.Admin + "," + Roles.InvestigatingOfficer)]
    public async Task<IActionResult> UpdateCase(int id, [FromBody] UpdateCaseRequest request)
    {
        var crimeCase = await _context.Cases.FindAsync(id);

        if (crimeCase == null)
            return NotFound("Case not found.");

        crimeCase.Title = request.Title;
        crimeCase.Description = request.Description;
        crimeCase.CrimeType = request.CrimeType;
        crimeCase.Location = request.Location;

        // FIX: Convert to UTC for PostgreSQL
        crimeCase.IncidentDate = DateTime.SpecifyKind(request.IncidentDate, DateTimeKind.Utc);

        crimeCase.Status = request.Status;

        await _context.SaveChangesAsync();

        return Ok(crimeCase);
    }

    // Delete a case
    [HttpDelete("{id}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> DeleteCase(int id)
    {
        var crimeCase = await _context.Cases.FindAsync(id);

        if (crimeCase == null)
            return NotFound("Case not found.");

        _context.Cases.Remove(crimeCase);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Case deleted successfully."
        });
    }

    // Search cases
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest("Search query is required.");

        var result = await _context.Cases
            .Where(c =>
                c.CaseNumber.Contains(query) ||
                c.Title.Contains(query))
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return Ok(result);
    }
}