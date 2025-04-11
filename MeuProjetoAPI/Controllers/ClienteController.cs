using MeuProjetoAPI.EF;
using MeuProjetoAPI.Entidades;
using MeuProjetoAPI.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static MeuProjetoAPI.Model.ClienteModel;

namespace MeuProjetoAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ClienteController : ControllerBase
{
    [HttpPost]
    [Route("CreateCliente")]
    public async Task<IActionResult> Create([FromBody] ClienteEntidade cliente)
    {
        if (cliente == null)
            return BadRequest("Dados do cliente inválidos.");

        using var context = new SiteDbContext();

        // Verifica se o CPF ou Email já existem
        var clienteExistente = await context.Cliente
            .FirstOrDefaultAsync(x => x.Cpf == cliente.Cpf || x.Email == cliente.Email);

        if (clienteExistente != null)
            return Conflict("Cliente já cadastrado com estas informações");

        // Criptografa a senha
        cliente.Senha = BCrypt.Net.BCrypt.HashPassword(cliente.Senha);

        // Define a referência ao Cliente em cada endereço
        if (cliente.EnderecosEntrega != null)
        {
            foreach (var endereco in cliente.EnderecosEntrega)
            {
                endereco.Cliente = cliente; // 👈 Define a referência aqui
            }
        }

        await context.Cliente.AddAsync(cliente);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(Create), new { id = cliente.Id }, cliente);
    }

    [HttpGet]
    [Route("ListarUsuários")]
    public async Task<List<ClienteEntidade>> List()
    {
        using var context = new SiteDbContext();
        return await context.Cliente
            .Include(c => c.EnderecosEntrega)
            .ToListAsync();
    }

    [HttpGet]
    [Route("ObterClientePorId/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        using var context = new SiteDbContext();

        var cliente = await context.Cliente
            .Include(c => c.EnderecosEntrega) 
            .FirstOrDefaultAsync(x => x.Id == id);

        if (cliente == null)
            return NotFound("Cliente não encontrado");

        return Ok(cliente);
    }

    [HttpPut]
    [Route("UpdateCliente")]
    public async Task<IActionResult> Update([FromBody] AtualizarClienteModel model)
    {
        using var context = new SiteDbContext();

        // Recupera o cliente atual
        var cliente = await context.Cliente
            .Include(c => c.EnderecosEntrega)
            .FirstOrDefaultAsync(x => x.Id == model.Id);

        if (cliente == null)
            return NotFound("Cliente não encontrado");

        // Atualiza os dados pessoais
        if (!string.IsNullOrEmpty(model.NomeCompleto))
            cliente.Name = model.NomeCompleto;

        if (model.DataNascimento.HasValue)
            cliente.Dt_Nascimento = model.DataNascimento.Value;

        if (model.Genero.HasValue)
            cliente.Genero = model.Genero.Value;

        // Atualiza os endereços de entrega
        if (model.EnderecosEntrega != null && model.EnderecosEntrega.Any())
        {
            // Remove endereços existentes
            context.Endereco.RemoveRange(cliente.EnderecosEntrega);

            // Adiciona os novos endereços
            foreach (var enderecoModel in model.EnderecosEntrega)
            {
                var endereco = new EnderecoEntidade
                {
                    Cep = enderecoModel.Cep,
                    Logradouro = enderecoModel.Logradouro,
                    Numero = enderecoModel.Numero,
                    Complemento = enderecoModel.Complemento,
                    Bairro = enderecoModel.Bairro,
                    Cidade = enderecoModel.Cidade,
                    Uf = enderecoModel.Uf,
                    Cliente = cliente
                };
                await context.Endereco.AddAsync(endereco);
            }
        }

        try
        {
            await context.SaveChangesAsync();
            return Ok("Dados do cliente atualizados com sucesso!");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao atualizar cliente: {ex.Message}");
        }
    }

    [HttpDelete]
    [Route("DeleteUsuário")]
    public async Task<string> Delete(int Id)
    {
        // Instância do Data Context
        using var context = new SiteDbContext();

        // Recupera a entidade (Re-hidratação)
        var task = await context.Cliente.FirstOrDefaultAsync(x => x.Id == Id);

        if (task is null)
            return "Usuário não encontrado";

        // Remove ela do DataContext
        context.Cliente.Remove(task);

        // Persiste os dados no banco
        await context.SaveChangesAsync();

        return "Usuário removido com sucesso!";
    }

    [HttpPut]
    [Route("AlterarSenha/{id}")]
    public async Task<IActionResult> ChangePassword(int id, [FromBody] AlterarSenhaClienteModel model)
    {
        using var context = new SiteDbContext();

        // Verifica se o usuário existe
        var cliente = await context.Cliente.FirstOrDefaultAsync(x => x.Id == id);
        if (cliente is null)
            return NotFound("Usuário não encontrado.");

        // Valida a nova senha
        if (string.IsNullOrEmpty(model.NovaSenha) || model.NovaSenha.Length < 6)
            return BadRequest("A senha deve ter pelo menos 6 caracteres.");

        // Criptografa a nova senha
        cliente.Senha = BCrypt.Net.BCrypt.HashPassword(model.NovaSenha);

        // Atualiza o usuário no banco de dados
        context.Cliente.Update(cliente);
        await context.SaveChangesAsync();

        return Ok("Senha alterada com sucesso!");
    }
}
