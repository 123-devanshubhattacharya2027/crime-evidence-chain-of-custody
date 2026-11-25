
using System.ComponentModel.DataAnnotations;

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

        // Navigation Property
        public Case Case { get; set; } = null!;

        // Evidence File Metadata
        [MaxLength(255)]
        public string? FileName { get; set; }

        [MaxLength(255)]
        public string? StoredFileName { get; set; }

        [MaxLength(500)]
        public string? FilePath { get; set; }

        [MaxLength(100)]
        public string? ContentType { get; set; }

        public long? FileSize { get; set; }

        public DateTime? UploadedAt { get; set; }

        public int? UploadedBy { get; set; }

        // Chain of Custody
        public ICollection<ChainOfCustody> ChainOfCustodies { get; set; }
            = new List<ChainOfCustody>();

        // Forensic Examinations
        public ICollection<ForensicExamination> ForensicExaminations { get; set; }
            = new List<ForensicExamination>();
    }
}
