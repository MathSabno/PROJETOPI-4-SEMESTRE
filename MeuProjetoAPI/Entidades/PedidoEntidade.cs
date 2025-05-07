using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MeuProjetoAPI.Entidades;

public class PedidoEntidade
{
    public PedidoEntidade() { }

    public PedidoEntidade(int id, decimal vlTotal, DateTime dhPedido, string statusPedido)
    {
        Id = id;
        StatusPedido = statusPedido;
        ValorTotal = vlTotal;
        DataPedido = dhPedido;
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(2000)")]
    public string StatusPedido { get; set; } = string.Empty;

    [Required]
    public decimal ValorTotal { get; set; }

    [Required]
    public DateTime DataPedido { get; set; }
}
