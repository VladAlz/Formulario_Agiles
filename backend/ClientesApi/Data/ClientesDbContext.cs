using ClientesApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ClientesApi.Data
{
    public class ClientesDbContext : DbContext
    {
        public ClientesDbContext(DbContextOptions<ClientesDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cliente> CLIENTES { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>(entity =>
            {
                entity.ToTable("CLIENTES");

                entity.HasKey(e => e.ID_CLI);

                entity.Property(e => e.ID_CLI).HasColumnName("ID_CLI").HasMaxLength(10);
                entity.Property(e => e.NOM_CLI).HasColumnName("NOM_CLI").HasMaxLength(50).IsRequired();
                entity.Property(e => e.APE_CLI).HasColumnName("APE_CLI").HasMaxLength(50).IsRequired();
                entity.Property(e => e.CED_CLI).HasColumnName("CED_CLI").HasMaxLength(15).IsRequired();
                entity.Property(e => e.TEL_CLI).HasColumnName("TEL_CLI").HasMaxLength(15).IsRequired();
                entity.Property(e => e.DIR_CLI).HasColumnName("DIR_CLI").HasMaxLength(100).IsRequired();
                entity.Property(e => e.COR_CLI).HasColumnName("COR_CLI").HasMaxLength(80).IsRequired();
            });
        }
    }
}