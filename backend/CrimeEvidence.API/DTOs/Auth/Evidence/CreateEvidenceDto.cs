using System.ComponentModel.DataAnnotations;

namespace CrimeEvidence.API.DTOs.Evidence
{
    public class CreateEvidenceDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = "";

        public string Description { get; set; } = "";

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = "";

        public string CollectedBy { get; set; } = "";

        public string StorageLocation { get; set; } = "";

        [Required]
        public int CaseId { get; set; }
    }
}