
using CrimeEvidence.API.Constants;
using CrimeEvidence.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CrimeEvidence.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.SeniorOfficer}")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var allowedRoles = new[]
            {
                Roles.Admin,
                Roles.SeniorOfficer,
                Roles.InvestigatingOfficer,
                Roles.EvidenceOfficer,
                Roles.ForensicOfficer
            };

            var users = await _context.Users
                .AsNoTracking()
                .Where(u => allowedRoles.Contains(u.Role))
                .OrderBy(u => u.FullName)
                .Select(u => new
                {
                    id = u.Id,
                    name = u.FullName,
                    email = u.Email,
                    role = u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/Users/8
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var allowedRoles = new[]
            {
                Roles.Admin,
                Roles.SeniorOfficer,
                Roles.InvestigatingOfficer,
                Roles.EvidenceOfficer,
                Roles.ForensicOfficer
            };

            var user = await _context.Users
                .AsNoTracking()
                .Where(u => u.Id == id && allowedRoles.Contains(u.Role))
                .Select(u => new
                {
                    id = u.Id,
                    name = u.FullName,
                    email = u.Email,
                    role = u.Role
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            return Ok(user);
        }
    }
}
