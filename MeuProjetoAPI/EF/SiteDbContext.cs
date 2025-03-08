using MeuProjetoAPI.Entidades;
using Microsoft.EntityFrameworkCore;

namespace MeuProjetoAPI.EF;

public class SiteDbContext : DbContext 
{
    public SiteDbContext() { }
    public DbSet<UsuarioEntidade> Usuarios { get; set; } = null!;
    public DbSet<ProdutoEntidade> Produto { get; set; } = null!;
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    => options.UseSqlServer("Server=(local)\\SQLEXPRESS;Database=PROJETOPI;Trusted_Connection=True;TrustServerCertificate=True;");
}
