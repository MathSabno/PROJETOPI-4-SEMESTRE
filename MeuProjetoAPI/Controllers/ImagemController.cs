using MeuProjetoAPI.EF;
using MeuProjetoAPI.Entidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeuProjetoAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ImagemController : ControllerBase
{
    private readonly SiteDbContext _context;
    private readonly IWebHostEnvironment _env;


    public ImagemController(SiteDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpPost("UploadImagem/{produtoId}")]
    public async Task<IActionResult> UploadImagem(int produtoId, IFormFile file, bool ehPadrao = false)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest("Arquivo inválido.");

            var extensoesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extensao = Path.GetExtension(file.FileName).ToLower();
            if (!extensoesPermitidas.Contains(extensao))
                return BadRequest("Tipo de arquivo não suportado. Use JPG, JPEG, PNG ou GIF.");

            var produto = await _context.Produto.Include(p => p.Imagens).FirstOrDefaultAsync(p => p.Id == produtoId);
            if (produto == null)
                return NotFound("Produto não encontrado.");

            var novoNome = Guid.NewGuid().ToString() + extensao;
            var caminhoPasta = Path.Combine(_env.WebRootPath, "imagens");
            var caminhoCompleto = Path.Combine(caminhoPasta, novoNome);

            if (!Directory.Exists(caminhoPasta))
                Directory.CreateDirectory(caminhoPasta);

            using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imagem = new ImagemEntidade
            {
                CaminhoImg = Path.Combine("imagens", novoNome), 
                EhPadrao = ehPadrao,
                Fk_produto = produtoId
            };

            if (ehPadrao)
            {
                foreach (var img in produto.Imagens)
                {
                    img.EhPadrao = false;
                }
            }

            produto.Imagens.Add(imagem);
            await _context.SaveChangesAsync();

            return Ok(new { caminho = imagem.CaminhoImg });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno ao processar a imagem: {ex.Message}");
        }
    }
}
