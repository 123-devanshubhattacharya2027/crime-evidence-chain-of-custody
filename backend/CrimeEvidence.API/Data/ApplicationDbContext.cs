using CrimeEvidence.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CrimeEvidence.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Case> Cases { get; set; }
    public DbSet<Evidence> Evidences { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<ChainOfCustody> ChainOfCustodies { get; set; }
    public DbSet<ForensicExamination> ForensicExaminations { get; set; }
    public DbSet<ForensicDocument> ForensicDocuments { get; set; }
}