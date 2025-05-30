using MeuProjetoAPI.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjetoAPI.Manipuladores;
using BCrypt.Net; 

namespace MeuProjetoAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    [HttpPost]
    [Route("Login")]
    public async Task<IActionResult> Login([FromBody] UsuarioLoginComandoEntrada usuario)
    {
        // Verifica se os dados do usuário são válidos
        if (usuario is null || string.IsNullOrWhiteSpace(usuario.Senha) || string.IsNullOrWhiteSpace(usuario.Email)) 
            return BadRequest("Email e senha são obrigatórios.");

        using var context = new SiteDbContext(); //Criando uma nova instância do DbContext
        
        //Busca o usuário pelo email (não compara a senha ainda)
        var usuarioExistente = await context.Usuario
            .FirstOrDefaultAsync(x => x.Email == usuario.Email);

        // Verifica se o usuário existe
        if (usuarioExistente is null)
            return Unauthorized("Usuário não encontrado ou credenciais inválidas.");

        // Verifica se a senha fornecida corresponde ao hash armazenado
        bool senhaValida = BCrypt.Net.BCrypt.Verify(usuario.Senha, usuarioExistente.Senha);

        if (!senhaValida)
            return Unauthorized("Usuário não encontrado ou credenciais inválidas.");

        // Retorna sucesso com o grupo do usuário
        return Ok(new
        {
            Mensagem = "Login realizado com sucesso.",
            usuarioExistente.Grupo,
            usuarioExistente.Status
        });
    }

    [HttpPost]
    [Route("LoginCliente")]
    public async Task<IActionResult> LoginCliente([FromBody] ClienteLoginComandoEntrada usuario)
    {
        // Verifica se os dados do usuário são válidos
        if (usuario is null || string.IsNullOrEmpty(usuario.Senha) || string.IsNullOrEmpty(usuario.Email))
            return BadRequest("Email e senha são obrigatórios.");

        using var context = new SiteDbContext(); // Criando uma nova instância do DbContext

        // Busca o usuário pelo email (não compara a senha ainda)
        var usuarioExistente = await context.Cliente
            .FirstOrDefaultAsync(x => x.Email == usuario.Email);

        // Verifica se o usuário existe
        if (usuarioExistente is null)
            return Unauthorized("Usuário não encontrado ou credenciais inválidas.");

        // Verifica se a senha fornecida corresponde ao hash armazenado
        bool senhaValida = BCrypt.Net.BCrypt.Verify(usuario.Senha, usuarioExistente.Senha);

        if (!senhaValida)
            return Unauthorized("Usuário não encontrado ou credenciais inválidas.");

        // Retorna sucesso com o grupo do usuário
        return Ok(new
        {
            Mensagem = "Login realizado com sucesso.",
            Id = usuarioExistente.Id,
            Nome = usuarioExistente.Name // Retorna o nome do usuário
            
        });
    }
}