using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace MeuProjetoAPI.Entidades;

public class EnderecoEntidade
{
    public EnderecoEntidade() { }
    
    public EnderecoEntidade(string cep, string logradouro, string numero, string complemento,
                           string bairro, string cidade, string uf)
    {
        Cep = cep;
        Logradouro = logradouro;
        Numero = numero;
        Complemento = complemento;
        Bairro = bairro;
        Cidade = cidade;
        Uf = uf;
    }
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int ClienteId { get; set; }

    [ValidateNever] 
    [JsonIgnore]
    public ClienteEntidade Cliente { get; set; }

    [Required]
    [Column(TypeName = "VARCHAR(8)")]
    public string Cep { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(100)")]
    public string Logradouro { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(10)")]
    public string Numero { get; set; }

    [Column(TypeName = "NVARCHAR(50)")]
    public string Complemento { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(50)")]
    public string Bairro { get; set; }

    [Required]
    [Column(TypeName = "NVARCHAR(50)")]
    public string Cidade { get; set; }

    [Required]
    [Column(TypeName = "CHAR(2)")]
    public string Uf { get; set; }
}
