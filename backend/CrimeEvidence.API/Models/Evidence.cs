namespace CrimeEvidence.API.Models;

public class Evidence
{
    public int EvidenceId { get; set; }

    public string EvidenceNumber { get; set; } = string.Empty;

    public int CaseId { get; set; }

    public string EvidenceType { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string FoundLocation { get; set; } = string.Empty;

    public DateTime CollectedAt { get; set; }

    public string Status { get; set; } = "COLLECTED";

    public string? CurrentLocation { get; set; }

    public string? SealNumber { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}