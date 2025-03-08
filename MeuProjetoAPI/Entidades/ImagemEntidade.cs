using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using MeuProjetoAPI.Enums;

namespace MeuProjetoAPI.Entidades;

public class ImagemEntidade
{
    public ImagemEntidade()
    {
    }

    public ImagemEntidade(int id, string caminhoimg, bool imgPadrao, int fk_produto)
    {
        Id = id;
        CaminhoImg = caminhoimg;
        EhPadrao = imgPadrao;
        Fk_produto = fk_produto;
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(2000)")]
    public string CaminhoImg { get; set; } = string.Empty;

    [Required]
    public bool EhPadrao { get; set; }

    [ForeignKey("Produto")]
    public int Fk_produto { get; set; }

    public ProdutoEntidade Produto { get; set; }
}

