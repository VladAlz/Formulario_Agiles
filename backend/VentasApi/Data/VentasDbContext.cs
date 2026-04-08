using Microsoft.EntityFrameworkCore;
using VentasApi.Models;

namespace VentasApi.Data
{
    public class VentasDbContext : DbContext
    {
        public VentasDbContext(DbContextOptions<VentasDbContext> options)
            : base(options)
        {
        }

        public DbSet<Venta> VENTAS { get; set; }
        public DbSet<VentaDetalle> VENTA_DETALLES { get; set; }
        public DbSet<Producto> PRODUCTOS { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Venta>(entity =>
            {
                entity.ToTable("VENTAS");
                entity.HasKey(e => e.ID_VEN);

                entity.Property(e => e.ID_VEN).HasColumnName("ID_VEN").HasMaxLength(10);
                entity.Property(e => e.ID_CLI).HasColumnName("ID_CLI").HasMaxLength(10).IsRequired();
                entity.Property(e => e.FEC_VEN).HasColumnName("FEC_VEN");
                entity.Property(e => e.NUM_VEN).HasColumnName("NUM_VEN").HasMaxLength(20).IsRequired();
            });

            modelBuilder.Entity<VentaDetalle>(entity =>
            {
                entity.ToTable("VENTA_DETALLES");
                entity.HasKey(e => e.ID_VDE);

                entity.Property(e => e.ID_VDE).HasColumnName("ID_VDE").HasMaxLength(10);
                entity.Property(e => e.ID_VEN).HasColumnName("ID_VEN").HasMaxLength(10).IsRequired();
                entity.Property(e => e.ID_PRO).HasColumnName("ID_PRO").HasMaxLength(10).IsRequired();
                entity.Property(e => e.PRE_VDE).HasColumnName("PRE_VDE").HasColumnType("decimal(10,2)");
                entity.Property(e => e.CAN_VDE).HasColumnName("CAN_VDE");
                entity.Property(e => e.SUB_VDE).HasColumnName("SUB_VDE").HasColumnType("decimal(10,2)");
            });

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