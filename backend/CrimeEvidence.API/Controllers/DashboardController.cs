using CrimeEvidence.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrimeEvidence.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        return Ok(new
        {
            totalCases = await _context.Cases.CountAsync(),
            totalEvidence = await _context.Evidences.CountAsync(),
            openCases = await _context.Cases.CountAsync(c => c.Status == "Open"),
            closedCases = await _context.Cases.CountAsync(c => c.Status == "Closed")
        });
    }
}