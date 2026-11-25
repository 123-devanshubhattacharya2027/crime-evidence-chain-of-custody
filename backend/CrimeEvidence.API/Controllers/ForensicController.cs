
using CrimeEvidence.API.Constants;
using CrimeEvidence.API.DTOs.Forensic;
using CrimeEvidence.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CrimeEvidence.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ForensicController : ControllerBase
    {
        private readonly IForensicService _forensicService;

        public ForensicController(IForensicService forensicService)
        {
            _forensicService = forensicService;
        }

        // POST: api/Forensic
        // Only Admin, Senior Officer and Forensic Officer
        [HttpPost]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.ForensicOfficer)]
        public async Task<IActionResult> CreateExamination(
            [FromBody] CreateForensicDto dto)
        {
            var examinerId = User.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(examinerId))
                return Unauthorized("Examiner identity not found.");

            var result =
                await _forensicService.CreateExaminationAsync(
                    dto, examinerId);

            return Ok(result);
        }

        // GET: api/Forensic
        // All five roles can view examinations
        [HttpGet]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.InvestigatingOfficer + "," +
            Roles.EvidenceOfficer + "," +
            Roles.ForensicOfficer)]
        public async Task<IActionResult> GetAll()
        {
            var result =
                await _forensicService.GetAllExaminationsAsync();

            return Ok(result);
        }

        // GET: api/Forensic/5
        [HttpGet("{id:int}")]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.InvestigatingOfficer + "," +
            Roles.EvidenceOfficer + "," +
            Roles.ForensicOfficer)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _forensicService.GetByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // GET: api/Forensic/evidence/5
        [HttpGet("evidence/{evidenceId:int}")]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.InvestigatingOfficer + "," +
            Roles.EvidenceOfficer + "," +
            Roles.ForensicOfficer)]
        public async Task<IActionResult> GetByEvidence(int evidenceId)
        {
            var result =
                await _forensicService.GetByEvidenceAsync(evidenceId);

            return Ok(result);
        }

        // PUT: api/Forensic/5
        // Only Admin, Senior Officer and Forensic Officer
        [HttpPut("{id:int}")]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.ForensicOfficer)]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateForensicDto dto)
        {
            var result =
                await _forensicService.UpdateExaminationAsync(id, dto);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // POST: api/Forensic/documents/upload
        // Only Admin, Senior Officer and Forensic Officer
        [HttpPost("documents/upload")]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.ForensicOfficer)]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadDocument(
            [FromForm] UploadForensicDocumentDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("Please select a valid document.");

            var result =
                await _forensicService.UploadDocumentAsync(dto);

            return Ok(result);
        }

        // GET: api/Forensic/5/documents
        // All five roles can view document metadata
        [HttpGet("{id:int}/documents")]
        [Authorize(Roles =
            Roles.Admin + "," +
            Roles.SeniorOfficer + "," +
            Roles.InvestigatingOfficer + "," +
            Roles.EvidenceOfficer + "," +
            Roles.ForensicOfficer)]
        public async Task<IActionResult> GetDocuments(int id)
        {
            var result =
                await _forensicService.GetDocumentsAsync(id);

            return Ok(result);
        }
    }
}
