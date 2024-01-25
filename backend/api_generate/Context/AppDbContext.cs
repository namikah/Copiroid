using api_generate.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace api_generate.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<DynamicTable> Tables { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new DynamicTableConfiguration());
        }

    }

    public class BaseEntity
    {
        public int Id { get; set; }
    }

    public class DynamicTable : BaseEntity
    {
        public string Name { get; set; }
    }

    public class DynamicTableConfiguration : IEntityTypeConfiguration<DynamicTable>
    {
        public void Configure(EntityTypeBuilder<DynamicTable> builder)
        {
            builder.ToTable("DynamicTable");
            builder.HasNoKey();
        }
    }
}

