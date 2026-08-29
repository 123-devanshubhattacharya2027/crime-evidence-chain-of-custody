namespace CrimeEvidence.API.DTOs.Forensic
{
    public class ForensicDocumentDto
    {
        public int Id { get; set; }

        public string FileName { get; set; } = string.Empty;

        public string FileType { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; }
    }
}