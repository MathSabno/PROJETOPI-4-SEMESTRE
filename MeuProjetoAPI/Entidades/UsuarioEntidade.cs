using MeuProjetoAPI.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MeuProjetoAPI.Entidades;

public class UsuarioEntidade
{
    public UsuarioEntidade(int id, string name, string cpf, string email, string senha, EnumGrupoUsuario grupo, EnumStatus status)
    {
        Id = id;
        Name = name;
        Cpf = cpf;
        Email = email;
        Senha = senha;
        Grupo = grupo;
        Status = status;
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
    public EnumGrupoUsuario Grupo { get; set; } = 0;

    [Required]
    public EnumStatus Status { get; set; } = 0;
}