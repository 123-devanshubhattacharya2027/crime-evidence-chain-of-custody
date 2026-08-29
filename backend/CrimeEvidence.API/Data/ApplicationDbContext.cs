using Microsoft.EntityFrameworkCore;
using CrimeEvidence.API.Models;

namespace CrimeEvidence.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets
    public DbSet<User> Users { get; set; }
    public DbSet<Case> Cases { get; set; }
    public DbSet<Evidence> Evidences { get; set; }
    public DbSet<ChainOfCustody> ChainOfCustodies { get; set; }
    public DbSet<ForensicExamination> ForensicExaminations { get; set; }

    public DbSet<ForensicDocument> ForensicDocuments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Case -> Evidence
        modelBuilder.Entity<Evidence>()
            .HasOne(e => e.Case)
            .WithMany(c => c.Evidences)
            .HasForeignKey(e => e.CaseId)
            .OnDelete(DeleteBehavior.Cascade);

        // Evidence -> ChainOfCustody
        modelBuilder.Entity<ChainOfCustody>()
            .HasOne(c => c.Evidence)
            .WithMany(e => e.ChainOfCustodies)
            .HasForeignKey(c => c.EvidenceId)
            .OnDelete(DeleteBehavior.Cascade);

        // Evidence -> ForensicExamination
        modelBuilder.Entity<ForensicExamination>()
            .HasOne(f => f.Evidence)
            .WithMany(e => e.ForensicExaminations)
            .HasForeignKey(f => f.EvidenceId)
            .OnDelete(DeleteBehavior.Cascade);


    }
}