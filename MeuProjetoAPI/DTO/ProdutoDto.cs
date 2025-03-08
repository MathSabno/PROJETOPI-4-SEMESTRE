using MeuProjetoAPI.Enums;

namespace MeuProjetoAPI.DTO;

public class ProdutoDto
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public EnumAvaliacaoProduto AvaliacaoProduto { get; set; }
    public string Descricao { get; set; }
    public decimal Preco { get; set; }
    public int Quantidade { get; set; }
    public EnumStatus Status { get; set; }
    public List<ImagemDto> Imagens { get; set; }
}
