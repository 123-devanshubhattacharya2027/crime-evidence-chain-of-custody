using System.ComponentModel.DataAnnotations;

namespace CrimeEvidence.API.DTOs.Forensic;

public class UpdateForensicDto
{
    [Required]
    public string Status { get; set; } = string.Empty;

    public string Findings { get; set; } = string.Empty;

    public string ReportPath { get; set; } = string.Empty;

    public DateTime? CompletedAt { get; set; }
}