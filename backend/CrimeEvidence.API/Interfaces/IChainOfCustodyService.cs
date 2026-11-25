
using CrimeEvidence.API.DTOs.ChainOfCustody;

namespace CrimeEvidence.API.Interfaces
{
    public interface IChainOfCustodyService
    {
        Task<CustodyResponseDto?> CreateCustodyAsync(
            CreateCustodyDto dto,
            int fromUserId
        );

        Task<List<CustodyResponseDto>> GetEvidenceTimelineAsync(int evidenceId);

        Task<CustodyResponseDto?> GetByIdAsync(int id);
    }
}
