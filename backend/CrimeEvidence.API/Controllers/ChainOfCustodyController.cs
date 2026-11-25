
using System.Security.Claims;
using CrimeEvidence.API.Constants;
using CrimeEvidence.API.DTOs.ChainOfCustody;
using CrimeEvidence.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrimeEvidence.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChainOfCustodyController : ControllerBase
    {
        private readonly IChainOfCustodyService _custodyService;

        public ChainOfCustodyController(
            IChainOfCustodyService custodyService)
        {
            _custodyService = custodyService;
        }

        // POST: api/ChainOfCustody
        // Only Admin and Senior Officer can create transfers
        [HttpPost]
        [Authorize(Roles = $"{Roles.Admin},{Roles.SeniorOfficer}")]
        public async Task<IActionResult> CreateCustody(
            [FromBody] CreateCustodyDto dto)
        {
            try
            {
                // Get sender ID from authenticated JWT
                var userIdClaim = User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

                if (!int.TryParse(userIdClaim, out int fromUserId))
                {
                    return Unauthorized(new
                    {
                        message = "Invalid authenticated user identity."
                    });
                }

                var result = await _custodyService.CreateCustodyAsync(
                    dto,
                    fromUserId);

                if (result == null)
                {
                    return NotFound(new
                    {
                        message = "Evidence not found."
                    });
                }

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = result.Id },
                    result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // GET: api/ChainOfCustody/evidence/2
        // Get complete custody timeline for existing evidence
        [HttpGet("evidence/{evidenceId}")]
        public async Task<IActionResult> GetEvidenceTimeline(
            int evidenceId)
        {
            try
            {
                var timeline =
                    await _custodyService.GetEvidenceTimelineAsync(
                        evidenceId);

                return Ok(timeline);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new
                {
                    message = "Evidence not found."
                });
            }
        }

        // GET: api/ChainOfCustody/1
        // Get individual custody record
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var custody = await _custodyService.GetByIdAsync(id);

            if (custody == null)
            {
                return NotFound(new
                {
                    message = "Custody record not found."
                });
            }

            return Ok(custody);
        }
    }
}
