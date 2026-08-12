namespace CrimeEvidence.API.Models;

public class Case
{
    public int CaseId { get; set; }

    public string CaseNumber { get; set; } = string.Empty;

    public string CrimeType { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string CrimeLocation { get; set; } = string.Empty;

    public DateTime IncidentDate { get; set; }

    public string Status { get; set; } = "OPEN";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}