import React from "react";
import { useNavigate } from "react-router-dom"; // Importando useNavigate para redirecionamento

const HomeSite = () => {
  const navigate = useNavigate(); // Hook para navegação

  // Função para redirecionar para a página de cadastro
  const handleCadastrarUsuario = () => {
    navigate("/cadastro-usuario");
  };

  // Função para redirecionar para a página de consulta
  const handleConsultarUsuario = () => {
    navigate("/consulta-usuario");
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.titulo}>Bem-vindo ao Sistema de Usuários</h1>
        <div style={styles.botoesContainer}>
          <button onClick={handleCadastrarUsuario} style={styles.loginFormBtn}>
            Cadastrar Usuários
          </button>
          <button onClick={handleConsultarUsuario} style={styles.loginFormBtn}>
            Consultar Usuário
          </button>
        </div>
      </div>
    </div>
  );
};

// Estilos para a página inicial
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Nunito', sans-serif",
    margin: 0,
    padding: 0,
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
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
  botoesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
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
    height: "50px",
    background: "linear-gradient(to left, #21d4fd, #b721ff)",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      opacity: 0.9,
    },
  },
};

export default HomeSite;