using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrimeEvidence.API.Models
{
    public class ForensicDocument
    {
        public int Id { get; set; }

        [Required]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string FilePath { get; set; } = string.Empty;

        public string FileType { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ForensicExamination")]
        public int ForensicExaminationId { get; set; }

        public ForensicExamination? ForensicExamination { get; set; }
    }
}