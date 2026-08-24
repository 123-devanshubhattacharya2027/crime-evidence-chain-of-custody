namespace CrimeEvidence.API.DTOs.Cases
{
    public class UpdateCaseRequest
    {
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string CrimeType { get; set; } = "";
        public string Location { get; set; } = "";
        public DateTime IncidentDate { get; set; }
        public string Status { get; set; } = "";
    }
}