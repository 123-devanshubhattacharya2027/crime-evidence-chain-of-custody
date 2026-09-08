using CrimeEvidence.API.Data;
using CrimeEvidence.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrimeEvidence.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Cases
        [HttpGet]
        public async Task<IActionResult> GetCases()
        {
            var cases = await _context.Cases
                .Include(c => c.Evidences)
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
        public async Task<IActionResult> GetCase(int id)
        {
            var crimeCase = await _context.Cases
                .Include(c => c.Evidences)
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
        public async Task<IActionResult> SearchCases([FromQuery] string query = "")
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
        public async Task<ActionResult<Case>> CreateCase([FromBody] Case crimeCase)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Cases.Add(crimeCase);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCase), new { id = crimeCase.CaseId }, crimeCase);
        }

        // PUT: api/Cases/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCase(int id, [FromBody] Case updatedCase)
        {
            if (id != updatedCase.CaseId)
                return BadRequest();

            _context.Entry(updatedCase).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Cases.AnyAsync(c => c.CaseId == id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        // DELETE: api/Cases/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCase(int id)
        {
            var crimeCase = await _context.Cases.FindAsync(id);

            if (crimeCase == null)
                return NotFound();

            _context.Cases.Remove(crimeCase);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}