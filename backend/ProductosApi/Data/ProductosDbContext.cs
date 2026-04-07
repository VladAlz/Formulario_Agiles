using Microsoft.EntityFrameworkCore;
using ProductosApi.Models;

namespace ProductosApi.Data
{
    public class ProductosDbContext : DbContext
    {
        public ProductosDbContext(DbContextOptions<ProductosDbContext> options)
            : base(options)
        {
        }

        public DbSet<Producto> PRODUCTOS { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Producto>(entity =>
            {
                entity.ToTable("PRODUCTOS");

                entity.HasKey(e => e.ID_PRO);

                entity.Property(e => e.ID_PRO).HasColumnName("ID_PRO").HasMaxLength(10);
                entity.Property(e => e.NOM_PRO).HasColumnName("NOM_PRO").HasMaxLength(60).IsRequired();
                entity.Property(e => e.PRE_PRO).HasColumnName("PRE_PRO").HasColumnType("decimal(10,2)");
                entity.Property(e => e.STO_PRO).HasColumnName("STO_PRO");
            });
        }
    }
}