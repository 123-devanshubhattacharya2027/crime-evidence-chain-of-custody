using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrimeEvidence.API.Models
{
    public class ForensicExamination
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int EvidenceId { get; set; }

        [ForeignKey(nameof(EvidenceId))]
        public Evidence Evidence { get; set; }

        [Required]
        public string ExaminerId { get; set; }

        [Required]
        [MaxLength(100)]
        public string ExaminationType { get; set; }

        public string Findings { get; set; }

        [Required]
        public string Status { get; set; } = "Pending";

        public string ReportPath { get; set; }

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

      public ICollection<ForensicDocument> Documents { get; set; }
         = new List<ForensicDocument>();
    }
}