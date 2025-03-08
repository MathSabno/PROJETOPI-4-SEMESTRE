using MeuProjetoAPI.EF;
using MeuProjetoAPI.Entidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static MeuProjetoAPI.Controllers.UsuarioController;

namespace MeuProjetoAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ProdutoController : ControllerBase
{
    [HttpPost]
    [Route("CreateProduto")]
    public async Task<IActionResult> Create([FromBody] ProdutoEntidade produto)
    {
        if (produto == null)
            return BadRequest("Dados do produto inválidos.");

        using var context = new SiteDbContext();

        await context.Produto.AddAsync(produto);

        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(Create), new { id = produto.Id }, produto);
    }

    [HttpGet]
    [Route("ListarProdutos")]
    public async Task<List<ProdutoEntidade>> List()
    {
        using var context = new SiteDbContext();

        return await context.Produto.ToListAsync();
    }

    [HttpPut]
    [Route("UpdateProduto")]
    public async Task<string> Update(ProdutoEntidade tarefa)
    {
        using var context = new SiteDbContext();

        var task = await context.Produto.FirstOrDefaultAsync(x => x.Id == tarefa.Id);

        if (task is null)
            return "Produto não localizado";

        task.Nome = string.IsNullOrEmpty(tarefa.Nome) ? task.Nome : tarefa.Nome;
        task.Avaliacao = tarefa.Avaliacao;
        task.Descricao = string.IsNullOrEmpty(tarefa.Descricao) ? task.Descricao : tarefa.Descricao;

        context.Produto.Update(task);

        var t = await context.SaveChangesAsync();

        return "Produto atualizado com sucesso!";
    }

    [HttpDelete]
    [Route("DeleteProduto")]
    public async Task<string> Delete(int Id)
    {
        using var context = new SiteDbContext();

        var task = await context.Produto.FirstOrDefaultAsync(x => x.Id == Id);

        if (task is null)
            return "Produto não encontrado";

        context.Produto.Remove(task);

        await context.SaveChangesAsync();

        return "Produto removido com sucesso!";
    }
}
