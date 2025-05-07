using MeuProjetoAPI.Entidades;
using Microsoft.EntityFrameworkCore;

namespace MeuProjetoAPI.EF;

public class SiteDbContext : DbContext
{
    public SiteDbContext() { }
    public SiteDbContext(DbContextOptions<SiteDbContext> options) : base(options) { }
    public DbSet<UsuarioEntidade> Usuario { get; set; } = null!;
    public DbSet<ProdutoEntidade> Produto { get; set; } = null!;
    public DbSet<ImagemEntidade> Imagem { get; set; } = null!;
    public DbSet<ClienteEntidade> Cliente { get; set; } = null!;
    public DbSet<EnderecoEntidade> Endereco { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        if (!options.IsConfigured)
        {   
            options.UseSqlServer("Server=(LOCAL)\\MSSQLSERVER02;Database=PROJETOPI;Trusted_Connection=True;TrustServerCertificate=True;");
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Relação entre Produto e Imagem
        modelBuilder.Entity<ProdutoEntidade>()
            .HasMany(p => p.Imagens) // Um produto tem muitas imagens
            .WithOne(i => i.Produto)  // Uma imagem pertence a um produto
            .HasForeignKey(i => i.Fk_produto); // Chave estrangeira em ImagemEntidade

        // Relação entre Cliente e Endereco de Entrega
        modelBuilder.Entity<ClienteEntidade>()
            .HasMany(c => c.EnderecosEntrega)
            .WithOne(e => e.Cliente)
            .HasForeignKey(e => e.ClienteId)
            .OnDelete(DeleteBehavior.Cascade); // ou .Restrict dependendo da lógica

        base.OnModelCreating(modelBuilder);
    }
}