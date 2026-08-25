namespace CrimeEvidence.API.DTOs.Evidence
{
    public class EvidenceResponseDto
    {
        public int Id { get; set; }

        public string EvidenceNumber { get; set; } = "";

        public string Name { get; set; } = "";

        public string Description { get; set; } = "";

        public string Category { get; set; } = "";

        public string Status { get; set; } = "";

        public DateTime CollectedAt { get; set; }

        public string CollectedBy { get; set; } = "";

        public string StorageLocation { get; set; } = "";

        public int CaseId { get; set; }
    }
}