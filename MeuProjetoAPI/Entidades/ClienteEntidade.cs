using MeuProjetoAPI.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace MeuProjetoAPI.Entidades;

public class ClienteEntidade
{
    public ClienteEntidade()
    {
    }

    public ClienteEntidade(int id, string name, string cpf, string email, string senha, DateTime dt_nascimento, EnumGenero genero,
                           string cepFaturamento, string logradouroFaturamento, string numeroFaturamento, string complementoFaturamento,
                           string bairroFaturamento, string cidadeFaturamento, string ufFaturamento)
    {
        Id = id;
        Name = name;
        Cpf = cpf;
        Email = email;
        Senha = senha;
        Dt_Nascimento = dt_nascimento;
        Genero = genero;
        EnderecosEntrega = new List<EnderecoEntidade>();
    }

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(100)")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "VARCHAR(14)")]
    public string Cpf { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "NVARCHAR(255)")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "VARCHAR(255)")]
    public string Senha { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "DATE")]
    public DateTime Dt_Nascimento { get; set; }

    [Required]
    [Column(TypeName = "VARCHAR(20)")]
    public EnumGenero Genero { get; set; }

    [Required]
    [Column(TypeName = "VARCHAR(8)")]
    public string CepFaturamento { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(100)")]
    public string LogradouroFaturamento { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(10)")]
    public string NumeroFaturamento { get; set; }

    [Column(TypeName = "NVARCHAR(50)")]
    public string ComplementoFaturamento { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(50)")]
    public string BairroFaturamento { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(50)")]
    public string CidadeFaturamento { get; set; }

    [Required]
    [Column(TypeName = "CHAR(2)")]
    public string UfFaturamento { get; set; }

    public ICollection<EnderecoEntidade> EnderecosEntrega { get; set; }
}
