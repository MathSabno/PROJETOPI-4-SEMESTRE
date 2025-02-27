import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importando useLocation para acessar o estado

const HomeSite = () => {
  const navigate = useNavigate(); // Hook para navegação
  const location = useLocation(); // Hook para acessar o estado passado na navegação

  const userGroup = location.state?.userGroup; // Acessa o grupo do usuário

  console.log("Estado passado:", location.state); // Depuração
  console.log("Grupo do usuário:", userGroup); // Depuração

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.titulo}>Bem-vindo ao Sistema de Usuários</h1>
        <div style={styles.botoesContainer}>
          <button style={styles.loginFormBtn}>
            Consultar Produto
          </button>
          {/* Mostra o botão "Consultar Usuário" apenas para Administradores */}
          {userGroup === 1 && (
            <button onClick={() => navigate("/consulta-usuario")} style={styles.loginFormBtn}>
              Consultar Usuário
            </button>
          )}
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
    backgroundColor: "#484D50",
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