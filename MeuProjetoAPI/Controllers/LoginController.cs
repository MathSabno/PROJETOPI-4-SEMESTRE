using MeuProjetoAPI.EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuProjetoAPI.Manipuladores;
using BCrypt.Net; // Adicione esta linha para usar o BCrypt

namespace MeuProjetoAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    [HttpPost]
    [Route("Login")]
    public async Task<IActionResult> Login([FromBody] UsuarioLoginManipulador usuario)
    {
        // Verifica se os dados do usuário são válidos
        if (usuario == null || string.IsNullOrEmpty(usuario.Senha) || string.IsNullOrEmpty(usuario.Email))
            return BadRequest("Email e senha são obrigatórios.");

        using var context = new UsuarioDbContext(); // Criando uma nova instância do DbContext

        // Busca o usuário pelo email (não compara a senha ainda)
        var usuarioExistente = await context.Usuarios
            .FirstOrDefaultAsync(x => x.Email == usuario.Email);

        // Verifica se o usuário existe
        if (usuarioExistente is null)
            return Unauthorized("Usuário não encontrado ou credenciais inválidas.");

        // Verifica se a senha fornecida corresponde ao hash armazenado
        bool senhaValida = BCrypt.Net.BCrypt.Verify(usuario.Senha, usuarioExistente.Senha);

        if (!senhaValida)
            return Unauthorized("Usuário não encontrado ou credenciais inválidas.");

        // Se tudo estiver correto, retorna sucesso com o grupo do usuário
        return Ok(new
        {
            Mensagem = "Login realizado com sucesso.",
            Grupo = usuarioExistente.Grupo // Retorna o grupo do usuário
        });
    }
}