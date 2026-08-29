using Microsoft.AspNetCore.Http;

namespace CrimeEvidence.API.DTOs.Forensic
{
    public class UploadForensicDocumentDto
    {
        public int ForensicExaminationId { get; set; }

        public IFormFile File { get; set; } = null!;
    }
}