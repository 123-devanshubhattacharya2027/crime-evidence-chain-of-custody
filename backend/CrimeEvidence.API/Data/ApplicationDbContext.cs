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

    public DbSet<Evidence> Evidence => Set<Evidence>();

    public DbSet<User> Users { get; set; }
}