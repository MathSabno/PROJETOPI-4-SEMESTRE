namespace MeuProjetoAPI.Model
{
    public class UsuarioModel
    {
        // Modelo para a requisição de alteração de senha
        public class AlterarSenhaModel
        {
            public required string NovaSenha { get; set; }
        }
    }
}
