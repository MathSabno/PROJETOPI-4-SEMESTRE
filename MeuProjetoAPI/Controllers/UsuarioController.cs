using MeuProjetoAPI.EF;
using MeuProjetoAPI.Entidades;
using MeuProjetoAPI.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeuProjetoAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UsuarioController : ControllerBase
{
    [HttpPost]
    [Route("CreateUsuário")]
    public async Task<IActionResult> Create([FromBody] UsuarioEntidade usuario)
    {
        // Verifica se o objeto usuário é válido
        if (usuario == null)
            return BadRequest("Dados do usuário inválidos.");

        // Verifica se o CPF ou Email já estão cadastrados
        using var context = new UsuarioDbContext();
        var usuarioExistente = await context.Usuarios
            .FirstOrDefaultAsync(x => x.Cpf == usuario.Cpf || x.Email == usuario.Email);

        if (usuarioExistente != null)
            return Conflict("Já existe um usuário cadastrado com essas informações de CPF e/ou Email.");

        // Criptografa a senha antes de salvar no banco de dados
        usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);

        // Adiciona o usuário ao contexto
        await context.Usuarios.AddAsync(usuario);

        // Persiste as mudanças no banco de dados
        await context.SaveChangesAsync();

        // Retorna uma resposta de sucesso com o objeto criado
        return CreatedAtAction(nameof(Create), new { id = usuario.Id }, usuario);
    }

    [HttpGet]
    [Route("ListarUsuários")]
    public async Task<List<UsuarioEntidade>> List()
    {
        using var context = new UsuarioDbContext();

        // Lê todas as categorias
        return await context.Usuarios.ToListAsync();
    }

    [HttpPut]
    [Route("UpdateUsuário")]
    public async Task<string> Update(UsuarioEntidade tarefa)
    {
        // Instância do Data Context
        using var context = new UsuarioDbContext();

        // Recupera a entidade (Re-hidratação)
        var task = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == tarefa.Id);

        if (task is null)
            return "Usuário não encontrada";

        // Altera a entidade
        task.Name = string.IsNullOrEmpty(tarefa.Name) ? task.Name : tarefa.Name;
        task.Cpf = string.IsNullOrEmpty(tarefa.Cpf) ? task.Cpf : tarefa.Cpf;
        task.Grupo = tarefa.Grupo;
        task.Status = tarefa.Status;

        // Atualiza os dados no DataContext
        context.Usuarios.Update(task);

        // Persiste os dados no banco
        var t = await context.SaveChangesAsync();

        return "Usuário atualizado com sucesso!";
    }

    [HttpDelete]
    [Route("DeleteUsuário")]
    public async Task<string> Delete(int Id)
    {
        // Instância do Data Context
        using var context = new UsuarioDbContext();

        // Recupera a entidade (Re-hidratação)
        var task = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == Id);

        if (task is null)
            return "Usuário não encontrado";

        // Remove ela do DataContext
        context.Usuarios.Remove(task);

        // Persiste os dados no banco
        await context.SaveChangesAsync();

        return "Usuário removido com sucesso!";
    }

    [HttpPut]
    [Route("AlterarSenha/{id}")]
    public async Task<IActionResult> ChangePassword(int id, [FromBody] AlterarSenhaModel model)
    {
        using var context = new UsuarioDbContext();

        // Verifica se o usuário existe
        var usuario = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == id);
        if (usuario == null)
            return NotFound("Usuário não encontrado.");

        // Valida a nova senha
        if (string.IsNullOrEmpty(model.NovaSenha) || model.NovaSenha.Length < 6)
            return BadRequest("A senha deve ter pelo menos 6 caracteres.");

        // Criptografa a nova senha
        usuario.Senha = BCrypt.Net.BCrypt.HashPassword(model.NovaSenha);

        // Atualiza o usuário no banco de dados
        context.Usuarios.Update(usuario);
        await context.SaveChangesAsync();

        return Ok("Senha alterada com sucesso!");
    }

    // Modelo para a requisição de alteração de senha
    public class AlterarSenhaModel
    {
        public string NovaSenha { get; set; }
    }
}
