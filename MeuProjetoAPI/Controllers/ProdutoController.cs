using MeuProjetoAPI.DTO;
using MeuProjetoAPI.EF;
using MeuProjetoAPI.Entidades;
using MeuProjetoAPI.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static MeuProjetoAPI.Model.ProdutoModel;

[ApiController]
[Route("api/[controller]")]
public class ProdutoController : ControllerBase
{
    private readonly SiteDbContext _context;

    public ProdutoController(SiteDbContext context)
    {
        _context = context;
    }

    [HttpPost("CreateProduto")]
    public async Task<IActionResult> Create([FromForm] ProdutoRequest produtoRequest)
    {
        if (produtoRequest == null)
            return BadRequest("Dados do produto inválidos.");

        var produto = new ProdutoEntidade
        {
            Nome = produtoRequest.Nome,
            Descricao = produtoRequest.Descricao,
            Avaliacao = (EnumAvaliacaoProduto)produtoRequest.Avaliacao,
            Preco = produtoRequest.Preco,
            Quantidade = produtoRequest.QuantidadeEstoque,
            Status = EnumStatus.Ativo
        };

        _context.Produto.Add(produto);
        await _context.SaveChangesAsync();

        
        if (produtoRequest.Imagens != null && produtoRequest.Imagens.Any())
        {
            foreach (var imagem in produtoRequest.Imagens)
            {
                var caminhoImagem = await SalvarImagem(imagem); 
                var imagemEntidade = new ImagemEntidade
                {
                    CaminhoImg = caminhoImagem,
                    EhPadrao = produtoRequest.ImagemPadraoIndex == produtoRequest.Imagens.IndexOf(imagem),
                    Fk_produto = produto.Id
                };

                _context.Imagem.Add(imagemEntidade);
            }
            
            await _context.SaveChangesAsync();
        }

        var produtoDto = new ProdutoDto
        {
            Id = produto.Id,
            Nome = produto.Nome,
            AvaliacaoProduto = produto.Avaliacao,
            Descricao = produto.Descricao,
            Preco = produto.Preco,
            Quantidade = produto.Quantidade,
            Status = produto.Status,
            Imagens = produto.Imagens.Select(i => new ImagemDto
            {
                Id = i.Id,
                CaminhoImg = i.CaminhoImg,
                EhPadrao = i.EhPadrao
            }).ToList()
        };

        return CreatedAtAction(nameof(Create), new { id = produto.Id }, produtoDto);
    }

    private async Task<string> SalvarImagem(IFormFile imagem)
    {
        var diretorioImagens = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imagens");
        if (!Directory.Exists(diretorioImagens))
        {
            Directory.CreateDirectory(diretorioImagens);
        }

        var nomeArquivo = Guid.NewGuid().ToString() + Path.GetExtension(imagem.FileName);
        var caminhoCompleto = Path.Combine(diretorioImagens, nomeArquivo);

        using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
        {
            await imagem.CopyToAsync(stream);
        }

        return Path.Combine("imagens", nomeArquivo); // Retorna o caminho relativo
    }

    [HttpGet("ListarProdutos")]
    public async Task<ActionResult<List<ProdutoDto>>> List()
    {
        var produtos = await _context.Produto
            .Include(p => p.Imagens)
            .Select(p => new ProdutoDto
            {
                Id = p.Id,
                Nome = p.Nome,
                Descricao = p.Descricao,
                Preco = p.Preco,
                Quantidade = p.Quantidade,
                AvaliacaoProduto = p.Avaliacao,
                Status = p.Status,
                Imagens = p.Imagens.Select(i => new ImagemDto
                {
                    Id = i.Id,
                    CaminhoImg = i.CaminhoImg,
                    EhPadrao = i.EhPadrao
                }).ToList()
            })
            .ToListAsync();

        return Ok(produtos);
    }

    [HttpGet("BuscarProdutoPorId/{id}")]
    public async Task<ActionResult<ProdutoDto>> BuscarPorId(int id)
    {
        var produto = await _context.Produto
            .Include(p => p.Imagens)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (produto == null)
            return NotFound("Produto não encontrado.");

        var produtoDto = new ProdutoDto
        {
            Id = produto.Id,
            Nome = produto.Nome,
            Descricao = produto.Descricao,
            Preco = produto.Preco,
            Quantidade = produto.Quantidade,
            AvaliacaoProduto = produto.Avaliacao,
            Status = produto.Status,
            Imagens = produto.Imagens.Select(i => new ImagemDto
            {
                Id = i.Id,
                CaminhoImg = i.CaminhoImg,
                EhPadrao = i.EhPadrao
            }).ToList()
        };

        return Ok(produtoDto);
    }

    [HttpPut("UpdateProduto")]
    public async Task<IActionResult> Update([FromForm] ProdutoRequest produtoRequest)
    {
        if (produtoRequest == null)
        {
            return BadRequest("Dados do produto inválidos.");
        }

        var produtoExistente = await _context.Produto
            .Include(p => p.Imagens)
            .FirstOrDefaultAsync(p => p.Id == produtoRequest.Id);

        if (produtoExistente == null)
            return NotFound("Produto não localizado");

        // Atualiza os campos do produto
        produtoExistente.Nome = produtoRequest.Nome;
        produtoExistente.Descricao = produtoRequest.Descricao;
        produtoExistente.Avaliacao = (EnumAvaliacaoProduto)produtoRequest.Avaliacao;
        produtoExistente.Preco = produtoRequest.Preco;
        produtoExistente.Quantidade = produtoRequest.QuantidadeEstoque;
        produtoExistente.Status = (EnumStatus)produtoRequest.Status;

        // Atualiza as imagens apenas se forem fornecidas
        if (produtoRequest.Imagens != null && produtoRequest.Imagens.Any())
        {
            foreach (var imagem in produtoRequest.Imagens)
            {
                var caminhoImagem = await SalvarImagem(imagem);
                var imagemEntidade = new ImagemEntidade
                {
                    CaminhoImg = caminhoImagem,
                    EhPadrao = produtoRequest.ImagemPadraoIndex == produtoRequest.Imagens.IndexOf(imagem),
                    Fk_produto = produtoExistente.Id
                };

                _context.Imagem.Add(imagemEntidade);
            }
        }

        _context.Produto.Update(produtoExistente);
        await _context.SaveChangesAsync();

        return Ok("Produto atualizado com sucesso!");
    }

    [HttpDelete("DeleteProduto/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var produto = await _context.Produto.Include(p => p.Imagens).FirstOrDefaultAsync(p => p.Id == id);

        if (produto == null)
            return NotFound("Produto não encontrado");

        _context.Produto.Remove(produto);
        await _context.SaveChangesAsync();

        return Ok("Produto removido com sucesso!");
    }
}