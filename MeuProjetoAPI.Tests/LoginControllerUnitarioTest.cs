using MeuProjetoAPI.Controllers;
using MeuProjetoAPI.EF;
using MeuProjetoAPI.Entidades;
using MeuProjetoAPI.Enums;
using MeuProjetoAPI.Manipuladores;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using static MeuProjetoAPI.Tests.TestHelpers;

namespace MeuProjetoAPI.Tests
{
    public class LoginControllerTeste
    {
        [Fact]
        public async Task LoginRetornarErroQuandoEmailOuSenhaEstiveremNulosOuVazios()
        {
            var mockContext = new Mock<SiteDbContext>();
            var controller = new LoginController(mockContext.Object);

            var result = await controller.Login(null);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Email e senha são obrigatórios.", badRequestResult.Value);
        }

        [Fact]
        public async Task LoginRetornarOkQuandoCredenciaisValidas()
        {
            var usuarioExistente = new UsuarioEntidade
            {
                Id = 1,
                Email = "teste@teste.com",
                Senha = BCrypt.Net.BCrypt.HashPassword("senhaCorreta"),
                Grupo = EnumGrupoUsuario.Administrador,
                Status = EnumStatus.Ativo
            };

            var data = new List<UsuarioEntidade> { usuarioExistente }.AsQueryable();

            var mockSet = new Mock<DbSet<UsuarioEntidade>>();
            mockSet.As<IQueryable<UsuarioEntidade>>().Setup(m => m.Provider)
                .Returns(new TestAsyncQueryProvider<UsuarioEntidade>(data.Provider));
            mockSet.As<IQueryable<UsuarioEntidade>>().Setup(m => m.Expression).Returns(data.Expression);
            mockSet.As<IQueryable<UsuarioEntidade>>().Setup(m => m.ElementType).Returns(data.ElementType);
            mockSet.As<IQueryable<UsuarioEntidade>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
            mockSet.As<IAsyncEnumerable<UsuarioEntidade>>()
                .Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<UsuarioEntidade>(data.GetEnumerator()));

            var mockContext = new Mock<SiteDbContext>();
            mockContext.Setup(c => c.Usuario).Returns(mockSet.Object);

            var controller = new LoginController(mockContext.Object);
            var usuarioEntrada = new UsuarioLoginComandoEntrada
            {
                Email = "teste@teste.com",
                Senha = "senhaCorreta"
            };

            var result = await controller.Login(usuarioEntrada);

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

        [Fact]
        public async Task LoginRetornarNaoAutorizadoQuandoUsuarioNaoEncontrado()
        {
            var data = new List<UsuarioEntidade>().AsQueryable();

            var mockSet = new Mock<DbSet<UsuarioEntidade>>();
            mockSet.As<IQueryable<UsuarioEntidade>>().Setup(m => m.Provider)
                .Returns(new TestAsyncQueryProvider<UsuarioEntidade>(data.Provider));
            mockSet.As<IQueryable<UsuarioEntidade>>().Setup(m => m.Expression).Returns(data.Expression);
            mockSet.As<IQueryable<UsuarioEntidade>>().Setup(m => m.ElementType).Returns(data.ElementType);
            mockSet.As<IQueryable<UsuarioEntidade>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());

            var mockContext = new Mock<SiteDbContext>();
            mockContext.Setup(c => c.Usuario).Returns(mockSet.Object);

            var controller = new LoginController(mockContext.Object);
            var usuario = new UsuarioLoginComandoEntrada
            {
                Email = "inexistente@teste.com",
                Senha = "senha123"
            };

            var result = await controller.Login(usuario);

            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Usuário não encontrado ou credenciais inválidas.", unauthorizedResult.Value);
        }
    }
}
