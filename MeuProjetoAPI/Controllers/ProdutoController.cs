using MeuProjetoAPI.DTO;
using MeuProjetoAPI.EF;
using MeuProjetoAPI.Entidades;
using MeuProjetoAPI.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            Avaliacao = produtoRequest.Avaliacao,
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
                Console.WriteLine($"Caminho da imagem salvo no banco: {imagemEntidade.CaminhoImg}");
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

    [HttpPut("UpdateProduto")]
    public async Task<IActionResult> Update([FromBody] ProdutoEntidade produto)
    {
        var produtoExistente = await _context.Produto.Include(p => p.Imagens).FirstOrDefaultAsync(p => p.Id == produto.Id);

        if (produtoExistente == null)
            return NotFound("Produto não localizado");

        produtoExistente.Nome = produto.Nome;
        produtoExistente.Avaliacao = produto.Avaliacao;
        produtoExistente.Descricao = produto.Descricao;
        produtoExistente.Preco = produto.Preco;
        produtoExistente.Quantidade = produto.Quantidade;
        produtoExistente.Status = produto.Status;

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

    public class ProdutoRequest
    {
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public EnumAvaliacaoProduto Avaliacao { get; set; }
        public decimal Preco { get; set; }
        public int QuantidadeEstoque { get; set; }
        public List<IFormFile> Imagens { get; set; }
        public int ImagemPadraoIndex { get; set; }
    }
}