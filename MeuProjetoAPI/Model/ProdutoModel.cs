using MeuProjetoAPI.Enums;

namespace MeuProjetoAPI.Model
{
    public class ProdutoModel
    {
        public class ProdutoRequest
        {
            public required string Nome { get; set; }
            public required string Descricao { get; set; }
            public EnumAvaliacaoProduto Avaliacao { get; set; }
            public decimal Preco { get; set; }
            public int QuantidadeEstoque { get; set; }
            public List<IFormFile> Imagens { get; set; }
            public int ImagemPadraoIndex { get; set; }
        }
    }
}
