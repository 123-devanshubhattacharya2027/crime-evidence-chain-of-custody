using System.ComponentModel.DataAnnotations;

namespace CrimeEvidence.API.DTOs.Cases;

public class CreateCaseRequest
{
    [Required]
    public string CaseNumber { get; set; } = "";

    [Required]
    public string Title { get; set; } = "";

    [Required]
    public string Description { get; set; } = "";

    [Required]
    public string CrimeType { get; set; } = "";

    public string Location { get; set; } = "";

    public DateTime IncidentDate { get; set; }
}