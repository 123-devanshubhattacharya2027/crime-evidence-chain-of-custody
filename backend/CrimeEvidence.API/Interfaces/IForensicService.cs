using CrimeEvidence.API.DTOs.Forensic;

namespace CrimeEvidence.API.Interfaces;

public interface IForensicService
{
    Task<ForensicResponseDto> CreateExaminationAsync(CreateForensicDto dto, string examinerId);

    Task<IEnumerable<ForensicResponseDto>> GetAllExaminationsAsync();

    Task<ForensicResponseDto?> GetByIdAsync(int id);

    Task<IEnumerable<ForensicResponseDto>> GetByEvidenceAsync(int evidenceId);

    Task<ForensicResponseDto?> UpdateExaminationAsync(int id, UpdateForensicDto dto);

    Task<ForensicDocumentDto> UploadDocumentAsync(UploadForensicDocumentDto dto);

    Task<List<ForensicDocumentDto>> GetDocumentsAsync(int forensicExaminationId);
}