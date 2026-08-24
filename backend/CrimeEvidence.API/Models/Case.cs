using System.ComponentModel.DataAnnotations;

namespace CrimeEvidence.API.Models
{
    public class Case
    {
        [Key]
        public int CaseId { get; set; }

        [Required]
        [MaxLength(30)]
        public string CaseNumber { get; set; } = "";

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = "";

        [Required]
        public string Description { get; set; } = "";

        [Required]
        public string CrimeType { get; set; } = "";

        public string Location { get; set; } = "";

        public DateTime IncidentDate { get; set; }

        public string Status { get; set; } = "Open";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}