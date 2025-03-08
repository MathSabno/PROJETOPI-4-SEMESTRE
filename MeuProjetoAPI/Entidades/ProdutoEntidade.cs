using MeuProjetoAPI.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MeuProjetoAPI.Entidades;

public class ProdutoEntidade
{
    public ProdutoEntidade(int id, string nome, EnumAvaliacaoProduto avaliacao, string descricao, decimal preco, int quantidade, string caminhoImg)
    {
        Id = id;
        Nome = nome;
        Avaliacao = avaliacao;
        Descricao = descricao;
        Preco = preco;
        Quantidade = quantidade;
        CaminhoImg = caminhoImg;
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(200)")]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public EnumAvaliacaoProduto Avaliacao { get; set; } = 0;

    [Required]
    [Column(TypeName = "NVARCHAR(2000)")]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "DECIMAL(18, 2)")]
    public decimal Preco { get; set; } 

    [Required]
    [Column(TypeName = "INT")]
    public int Quantidade { get; set; } 

    [Required]
    [Column(TypeName = "NVARCHAR(2000)")]
    public string CaminhoImg { get; set; } = string.Empty;
}
