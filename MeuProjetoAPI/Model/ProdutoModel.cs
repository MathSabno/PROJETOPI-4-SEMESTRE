using MeuProjetoAPI.Enums;

namespace MeuProjetoAPI.Model
{
    public class ProdutoModel
    {
        public class ProdutoRequest
        {
            public int Id { get; set; }
            public required string Nome { get; set; }
            public required string Descricao { get; set; }
            public int Avaliacao { get; set; }
            public decimal Preco { get; set; }
            public int QuantidadeEstoque { get; set; }
            public int Status {  get; set; }
            public List<IFormFile> Imagens { get; set; } = new List<IFormFile>();
            public int? ImagemPadraoIndex { get; set; }
        }
    }
}
