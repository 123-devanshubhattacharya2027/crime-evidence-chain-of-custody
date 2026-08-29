using System.ComponentModel.DataAnnotations;

namespace CrimeEvidence.API.DTOs.Forensic;

public class CreateForensicDto
{
    [Required]
    public int EvidenceId { get; set; }

    [Required]
    public string ExaminationType { get; set; } = string.Empty;

    public string Findings { get; set; } = string.Empty;

    public string ReportPath { get; set; } = string.Empty;
}