using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace CrimeEvidence.API.Models
{
    public class Evidence
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string EvidenceNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        public string Status { get; set; } = "Collected";

        public DateTime CollectedAt { get; set; } = DateTime.UtcNow;

        public string CollectedBy { get; set; } = string.Empty;

        public string StorageLocation { get; set; } = string.Empty;

        // Foreign Key
        public int CaseId { get; set; }

        // Navigation Property (One Evidence belongs to one Case)
        public Case Case { get; set; } = null!;

        // Day 6: One Evidence can have many Chain of Custody records
        public ICollection<ChainOfCustody> ChainOfCustodies { get; set; }
            = new List<ChainOfCustody>();

            // Day 7: One Evidence can have many Forensic Examinations
public ICollection<ForensicExamination> ForensicExaminations { get; set; }
    = new List<ForensicExamination>();
    }
}