using System.ComponentModel.DataAnnotations;

namespace CrimeEvidence.API.DTOs.Evidence
{
    public class UpdateEvidenceDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = "";

        public string Description { get; set; } = "";

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = "";

        public string Status { get; set; } = "Collected";

        public string StorageLocation { get; set; } = "";
    }
}