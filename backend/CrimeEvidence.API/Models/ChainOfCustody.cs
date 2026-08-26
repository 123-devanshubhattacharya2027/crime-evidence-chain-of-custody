using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrimeEvidence.API.Models
{
    public class ChainOfCustody
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int EvidenceId { get; set; }

        [ForeignKey("EvidenceId")]
        public Evidence Evidence { get; set; } = null!;

        [Required]
        public int FromUserId { get; set; }

        [Required]
        public int ToUserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Action { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Location { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}