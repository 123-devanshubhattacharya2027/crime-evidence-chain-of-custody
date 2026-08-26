using CrimeEvidence.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CrimeEvidence.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Case> Cases => Set<Case>();

    public DbSet<Evidence> Evidences => Set<Evidence>();

    public DbSet<User> Users { get; set; } = null!;

    // Day 6: Chain of Custody table
    public DbSet<ChainOfCustody> ChainOfCustodies => Set<ChainOfCustody>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Case -> Evidence (One Case has many Evidence items)
        modelBuilder.Entity<Evidence>()
            .HasOne(e => e.Case)
            .WithMany(c => c.Evidences)
            .HasForeignKey(e => e.CaseId)
            .OnDelete(DeleteBehavior.Cascade);

        // Evidence -> ChainOfCustody (One Evidence has many custody records)
        modelBuilder.Entity<ChainOfCustody>()
            .HasOne(c => c.Evidence)
            .WithMany(e => e.ChainOfCustodies)
            .HasForeignKey(c => c.EvidenceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}