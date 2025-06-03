using MeuProjetoAPI.Controllers;
using MeuProjetoAPI.EF;
using MeuProjetoAPI.Entidades;
using MeuProjetoAPI.Enums;
using MeuProjetoAPI.Manipuladores;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MeuProjetoAPI.Tests;
public class LoginControllerIntegracaoTest : IDisposable
{
    private readonly SiteDbContext _context;
    private readonly LoginController _controller;

    public LoginControllerIntegracaoTest()
    {
        var options = new DbContextOptionsBuilder<SiteDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        _context = new SiteDbContext(options);
        _controller = new LoginController(_context);

        _context.Usuario.Add(new UsuarioEntidade
        {
            Id = 1,
            Email = "teste@teste.com",
            Senha = BCrypt.Net.BCrypt.HashPassword("senhaCorreta"),
            Grupo = EnumGrupoUsuario.Administrador,
            Status = EnumStatus.Ativo
        });
        _context.SaveChanges();
    }

    [Fact]
    public async Task LoginDeveRetornarOkQuandoCredenciaisValidas()
    {
        var usuarioEntrada = new UsuarioLoginComandoEntrada
        {
            Email = "teste@teste.com",
            Senha = "senhaCorreta"
        };
        var result = await _controller.Login(usuarioEntrada);

        var okResult = Assert.IsType<OkObjectResult>(result);

        var value = okResult.Value;
        Assert.NotNull(value);

        var tipo = value.GetType();
        var mensagemProp = tipo.GetProperty("Mensagem");
        var grupoProp = tipo.GetProperty("Grupo");
        var statusProp = tipo.GetProperty("Status");

        Assert.NotNull(mensagemProp);
        Assert.NotNull(grupoProp);
        Assert.NotNull(statusProp);

        Assert.Equal("Login realizado com sucesso.", mensagemProp.GetValue(value));
        Assert.Equal(EnumGrupoUsuario.Administrador, grupoProp.GetValue(value));
        Assert.Equal(EnumStatus.Ativo, statusProp.GetValue(value));
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
    }
}
