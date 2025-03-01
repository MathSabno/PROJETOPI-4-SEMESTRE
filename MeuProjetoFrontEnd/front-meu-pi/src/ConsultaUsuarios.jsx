import React, { useEffect, useState } from "react";
import authService from "../src/services/authService"; // Importando o serviço
import { useNavigate } from "react-router-dom"; // Importando useNavigate para redirecionamento

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
  const alterarUsuario = () => {
    if (usuariosSelecionados.length !== 1) {
      alert("Selecione exatamente um usuário para alterar.");
      return;
    }

    const usuarioId = usuariosSelecionados[0];
    navigate(`/alterar-usuario/${usuarioId}`); // Redireciona para a tela de alteração de usuário
  };

  const alterarSenha = () => {
    if (usuariosSelecionados.length !== 1) {
      alert("Selecione exatamente um usuário para alterar.");
      return;
    }

    const usuarioId = usuariosSelecionados[0];
    navigate(`/alterar-senha/${usuarioId}`); // Redireciona para a tela de alteração de usuário
  };

  // Busca os usuários ao carregar o componente
  useEffect(() => {
    buscarUsuarios();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.titulo}>Consulta de Usuários</h1>
        {carregando ? (
          <div style={styles.carregando}>
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            <table style={styles.tabela}>
              <thead>
                <tr>
                  <th style={styles.cabecalho}></th>
                  <th style={styles.cabecalho}>ID</th>
                  <th style={styles.cabecalho}>Nome</th>
                  <th style={styles.cabecalho}>Email</th>
                  <th style={styles.cabecalho}>Status</th>
                  <th style={styles.cabecalho}>Grupo</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    style={{
                      ...styles.linha,
                      textDecoration: usuario.status === 2 ? "line-through" : "none",
                    }}
                  >
                    <td style={styles.celula}>
                      <input
                        type="checkbox"
                        checked={usuariosSelecionados.includes(usuario.id)}
                        onChange={() => toggleSelecaoUsuario(usuario.id)}
                      />
                    </td>
                    <td style={styles.celula}>{usuario.id}</td>
                    <td style={styles.celula}>{usuario.name}</td>
                    <td style={styles.celula}>{usuario.email}</td>
                    <td style={styles.celula}>{usuario.status === 1 ? "Ativo" : "Inativo"}</td>
                    <td style={styles.celula}>{usuario.grupo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={styles.botoesContainer}>
              <button onClick={alterarUsuario} style={styles.loginFormBtn}>
                ALTERAR USUÁRIO
              </button>
              <button onClick={alterarSenha} style={styles.loginFormBtn}>
                ALTERAR SENHA
              </button>
              <button onClick={desativarUsuarios} style={styles.loginFormBtn}>
                ATIVAR/DESATIVAR 
              </button>
              <button onClick={handleCadastrarUsuario} style={styles.loginFormBtn}>
                INCLUIR USUÁRIO
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Estilos para a tela
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Nunito', sans-serif",
    backgroundColor: "white",
    margin: 0,
    padding: 0,
  },
  formContainer: {
    width: "100%",
    maxWidth: "800px",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  titulo: {
    display: "block",
    fontSize: "30px",
    color: "#333",
    lineHeight: "1.2",
    textAlign: "center",
    marginBottom: "30px",
  },
  carregando: {
    fontSize: "1.2rem",
    color: "#666",
    textAlign: "center",
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  cabecalho: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "15px",
    textAlign: "left",
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  linha: {
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#f1f1f1",
    },
  },
  celula: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    fontSize: "1rem",
    color: "#555",
  },
  botoesContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
  },
  loginFormBtn: {
    fontSize: "15px",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    lineHeight: "1.2",
    textTransform: "uppercase",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "200px",
    height: "50px",
    background: "linear-gradient(to left, #21d4fd, #b721ff)",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      opacity: 0.9,
    },
  },
};

export default ConsultaUsuarios;