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

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Case -> Evidence relationship
        modelBuilder.Entity<Evidence>()
            .HasOne(e => e.Case)
            .WithMany(c => c.Evidences)
            .HasForeignKey(e => e.CaseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}