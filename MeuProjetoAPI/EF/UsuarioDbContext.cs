using MeuProjetoAPI.Entidades;
using Microsoft.EntityFrameworkCore;

namespace MeuProjetoAPI.EF;

public class UsuarioDbContext : DbContext 
{
    public UsuarioDbContext() { }
    public DbSet<UsuarioEntidade> Usuarios { get; set; } = null!;
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    => options.UseSqlServer("Server=(local)\\SQLEXPRESS02;Database=PROJETOPI;Trusted_Connection=True;TrustServerCertificate=True;");
}
