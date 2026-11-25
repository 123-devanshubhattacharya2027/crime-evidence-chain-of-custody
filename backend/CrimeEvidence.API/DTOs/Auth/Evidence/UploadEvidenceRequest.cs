
using Microsoft.AspNetCore.Http;

namespace CrimeEvidence.API.DTOs.Evidence;

public class UploadEvidenceRequest
{
    public IFormFile File { get; set; } = null!;

    public int CaseId { get; set; }

    public string EvidenceId { get; set; } = string.Empty;
}
