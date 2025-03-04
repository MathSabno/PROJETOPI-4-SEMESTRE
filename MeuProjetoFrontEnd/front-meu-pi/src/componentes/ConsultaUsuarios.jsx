import React, { useEffect, useState } from "react";
import authService from "../services/authService"; // Importando o serviço
import { useNavigate } from "react-router-dom"; // Importando useNavigate para redirecionamento
import "../estilos/consultaUsuario.css"; // Importando o arquivo CSS

const ConsultaUsuarios = () => {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]); // Estado para armazenar os usuários
  const [carregando, setCarregando] = useState(true); // Estado para controlar o carregamento
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([]); // Estado para armazenar os usuários selecionados

  // Função para buscar os usuários
  const buscarUsuarios = async () => {
    try {
      const usuarios = await authService.listarUsuarios(); // Usando o serviço
      setUsuarios(usuarios); // Atualiza o estado com os usuários
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setCarregando(false); // Finaliza o carregamento
    }
  };

  // Função para redirecionar para a página de cadastro
  const handleCadastrarUsuario = () => {
    navigate("/cadastro-usuario");
  };

  const handleHome = () => {
    navigate("/home-site");
  };

  // Função para alternar a seleção de um usuário
  const toggleSelecaoUsuario = (id) => {
    if (usuariosSelecionados.includes(id)) {
      setUsuariosSelecionados(usuariosSelecionados.filter((userId) => userId !== id));
    } else {
      setUsuariosSelecionados([...usuariosSelecionados, id]);
    }
  };

  // Função para desativar usuários selecionados
  const desativarUsuarios = async () => {
    if (usuariosSelecionados.length === 0) {
      alert("Selecione pelo menos um usuário para alterar o status.");
      return;
    }
  
    try {
      // Atualiza o status dos usuários selecionados (inverte o status)
      await Promise.all(
        usuariosSelecionados.map(async (id) => {
          const usuario = usuarios.find((u) => u.id === id);
          if (usuario) {
            // Inverte o status: 1 -> 2 ou 2 -> 1
            usuario.status = usuario.status === 1 ? 2 : 1;
            await authService.atualizarUsuario(usuario); // Chama a API para atualizar o usuário
          }
        })
      );
  
      alert("Status dos usuários atualizado com sucesso!");
      buscarUsuarios(); // Recarrega a lista de usuários
      setUsuariosSelecionados([]); // Limpa a seleção
    } catch (error) {
      console.error("Erro ao atualizar o status dos usuários:", error);
      alert("Erro ao atualizar o status dos usuários.");
    }
  };

  // Função para redirecionar para a tela de alteração de usuário
  const alterarUsuario = (id) => {
    navigate(`/alterar-usuario/${id}`); // Redireciona para a tela de alteração de usuário
  };

  const alterarSenha = (id) => {
    navigate(`/alterar-senha/${id}`); // Redireciona para a tela de alteração de senha
  };

  // Busca os usuários ao carregar o componente
  useEffect(() => {
    buscarUsuarios();
  }, []);

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="titulo">Consulta de Usuários</h1>
        {carregando ? (
          <div className="carregando">
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            <table className="tabela">
              <thead>
                <tr>
                  <th className="cabecalho"></th>
                  <th className="cabecalho">ID</th>
                  <th className="cabecalho">Nome</th>
                  <th className="cabecalho">Email</th>
                  <th className="cabecalho">Status</th>
                  <th className="cabecalho">Grupo</th>
                  <th className="cabecalho">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="linha"
                    style={{
                      textDecoration: usuario.status === 2 ? "line-through" : "none",
                    }}
                  >
                    <td className="celula">
                      <input
                        type="checkbox"
                        checked={usuariosSelecionados.includes(usuario.id)}
                        onChange={() => toggleSelecaoUsuario(usuario.id)}
                      />
                    </td>
                    <td className="celula">{usuario.id}</td>
                    <td className="celula">{usuario.name}</td>
                    <td className="celula">{usuario.email}</td>
                    <td className="celula">{usuario.status === 1 ? "Ativo" : "Inativo"}</td>
                    <td className="celula">{usuario.grupo}</td>
                    <td className="celula">
                      <button onClick={() => alterarUsuario(usuario.id)} className="acaoBtn">
                        Alterar
                      </button>
                      <button onClick={() => desativarUsuarios([usuario.id])} className="acaoBtn">
                        {usuario.status === 1 ? "Desativar" : "Ativar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="botoesContainer">
              <button onClick={handleCadastrarUsuario} className="loginFormBtn">
                INCLUIR USUÁRIO
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConsultaUsuarios;