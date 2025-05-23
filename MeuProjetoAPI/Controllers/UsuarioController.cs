﻿using MeuProjetoAPI.EF;
using MeuProjetoAPI.Entidades;
using MeuProjetoAPI.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static MeuProjetoAPI.Model.UsuarioModel;

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
        using var context = new SiteDbContext();
        var usuarioExistente = await context.Usuario   
            .FirstOrDefaultAsync(x => x.Cpf == usuario.Cpf || x.Email == usuario.Email);

        if (usuarioExistente != null)
            return Conflict("Já existe um usuário cadastrado com essas informações de CPF e/ou Email.");

        // Criptografa a senha antes de salvar no banco de dados
        usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);

        // Adiciona o usuário ao contexto
        await context.Usuario.AddAsync(usuario);

        // Salva o novo usuário no banco de dados
        await context.SaveChangesAsync();

        // Retorna uma resposta de sucesso com o objeto criado
        return CreatedAtAction(nameof(Create), new { id = usuario.Id }, usuario);
    }

    [HttpGet]
    [Route("ListarUsuários")]
    public async Task<List<UsuarioEntidade>> List()
    {
        using var context = new SiteDbContext();

        // Lê todas as categorias
        return await context.Usuario.ToListAsync();
    }

    [HttpPut]
    [Route("UpdateUsuário")]
    public async Task<string> Update(UsuarioEntidade tarefa)
    {
        // Instância do Data Context
        using var context = new SiteDbContext();

        // Recupera a entidade (Re-hidratação)
        if (await context.Usuario.FirstOrDefaultAsync(x => x.Id == tarefa.Id) == null)
            return "Usuário não encontrado";

        var usuarioExiste = await context.Usuario.FindAsync(tarefa.Id);

        if (usuarioExiste is null)
            Results.NotFound();

        usuarioExiste.Name = string.IsNullOrEmpty(tarefa.Name) ? usuarioExiste.Name : tarefa.Name;
        usuarioExiste.Email = string.IsNullOrEmpty(tarefa.Email) ? string.Empty : tarefa.Email;
        usuarioExiste.Cpf = string.IsNullOrEmpty(tarefa.Cpf) ? usuarioExiste.Cpf : tarefa.Cpf;
        usuarioExiste.Grupo = tarefa.Grupo;
        usuarioExiste.Status = tarefa.Status;

        try
        {
            // Atualiza os dados no DataContext
            context.Update(usuarioExiste);
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao atualizar os dados no DataContext: ", ex.InnerException);
        }

        // Persiste os dados no banco
        return context.SaveChangesAsync().Result > 1 ? "Usuário atualizado com sucesso!" : "Erro ao atualizar usuario";


    }

    [HttpDelete]
    [Route("DeleteUsuário")]
    public async Task<string> Delete(int Id)
    {
        // Instância do Data Context
        using var context = new SiteDbContext();

        // Recupera a entidade (Re-hidratação)
        var task = await context.Usuario.FirstOrDefaultAsync(x => x.Id == Id);

        if (task is null)
            return "Usuário não encontrado";

        // Remove ela do DataContext
        context.Usuario.Remove(task);

        // Persiste os dados no banco
        await context.SaveChangesAsync();

        return "Usuário removido com sucesso!";
    }

    [HttpPut]
    [Route("AlterarSenha/{id}")]
    public async Task<IActionResult> ChangePassword(int id, [FromBody] AlterarSenhaModel model)
    {
        using var context = new SiteDbContext();

        // Verifica se o usuário existe
        var usuario = await context.Usuario.FirstOrDefaultAsync(x => x.Id == id);
        if (usuario is null)
            return NotFound("Usuário não encontrado.");

        // Valida a nova senha
        if (string.IsNullOrEmpty(model.NovaSenha) || model.NovaSenha.Length < 6)
            return BadRequest("A senha deve ter pelo menos 6 caracteres.");

        // Criptografa a nova senha
        usuario.Senha = BCrypt.Net.BCrypt.HashPassword(model.NovaSenha);

        // Atualiza o usuário no banco de dados
        context.Usuario.Update(usuario);
        await context.SaveChangesAsync();

        return Ok("Senha alterada com sucesso!");
    }
}