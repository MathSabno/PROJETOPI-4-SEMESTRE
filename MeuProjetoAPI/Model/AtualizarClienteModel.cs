using MeuProjetoAPI.Enums;

namespace MeuProjetoAPI.Model;

public class AtualizarClienteModel
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; }
    public DateTime? DataNascimento { get; set; }
    public EnumGenero? Genero { get; set; }
    public List<EnderecoEntregaModel> EnderecosEntrega { get; set; }
}
