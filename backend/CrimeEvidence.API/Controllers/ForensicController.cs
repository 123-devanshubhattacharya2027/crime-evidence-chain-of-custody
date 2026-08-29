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

        // Test 1 - Create Forensic Examination
        [HttpPost]
        public async Task<IActionResult> CreateExamination([FromBody] CreateForensicDto dto)
        {
            var examinerId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "Unknown";

            var result = await _forensicService.CreateExaminationAsync(dto, examinerId);

            return Ok(result);
        }

        // Test 2 - Get All Forensic Examinations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _forensicService.GetAllExaminationsAsync();
            return Ok(result);
        }

        // Get Examination by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _forensicService.GetByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // Get Examinations by Evidence ID
        [HttpGet("evidence/{evidenceId}")]
        public async Task<IActionResult> GetByEvidence(int evidenceId)
        {
            var result = await _forensicService.GetByEvidenceAsync(evidenceId);
            return Ok(result);
        }

        // Test 3 - Update Examination
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateForensicDto dto)
        {
            var result = await _forensicService.UpdateExaminationAsync(id, dto);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // Test 5 - Upload Document
        [HttpPost("documents/upload")]
        public async Task<IActionResult> UploadDocument([FromForm] UploadForensicDocumentDto dto)
        {
            var result = await _forensicService.UploadDocumentAsync(dto);
            return Ok(result);
        }

        // Get Documents for an Examination
        [HttpGet("{id}/documents")]
        public async Task<IActionResult> GetDocuments(int id)
        {
            var result = await _forensicService.GetDocumentsAsync(id);
            return Ok(result);
        }
    }
}