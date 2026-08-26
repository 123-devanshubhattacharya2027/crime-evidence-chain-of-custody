using System.ComponentModel.DataAnnotations;

namespace CrimeEvidence.API.DTOs.ChainOfCustody
{
    public class CreateCustodyDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int EvidenceId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int FromUserId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int ToUserId { get; set; }

        [Required]
        [StringLength(50)]
        public string Action { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Location { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }
    }
}