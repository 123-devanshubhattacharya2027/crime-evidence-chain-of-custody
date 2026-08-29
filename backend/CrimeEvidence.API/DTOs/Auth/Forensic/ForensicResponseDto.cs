namespace CrimeEvidence.API.DTOs.Forensic;

public class ForensicResponseDto
{
    public int Id { get; set; }
    public int EvidenceId { get; set; }
    public string ExaminerId { get; set; } = string.Empty;
    public string ExaminationType { get; set; } = string.Empty;
    public string Findings { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ReportPath { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}