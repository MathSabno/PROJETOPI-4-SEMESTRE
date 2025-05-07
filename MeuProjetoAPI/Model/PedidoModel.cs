namespace MeuProjetoAPI.Model;

public class PedidoModel
{
    public string Status { get; set; } = string.Empty;
    public decimal VlTotal { get; set; }
    public DateTime DatePedido { get; set; }
}