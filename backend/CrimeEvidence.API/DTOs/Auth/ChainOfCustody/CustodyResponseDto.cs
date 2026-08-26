namespace CrimeEvidence.API.DTOs.ChainOfCustody
{
    public class CustodyResponseDto
    {
        public int Id { get; set; }

        public int EvidenceId { get; set; }

        public int FromUserId { get; set; }

        public int ToUserId { get; set; }

        public string Action { get; set; } = string.Empty;

        public string? Location { get; set; }

        public string? Notes { get; set; }

        public DateTime Timestamp { get; set; }
    }
}