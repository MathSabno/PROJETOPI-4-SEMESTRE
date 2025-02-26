import React, { useState } from "react";
import authService from "../src/services/authService"; // Importando o serviço de autenticação
import { useNavigate } from "react-router-dom"; // Importando useNavigate para redirecionamento

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.login(email, senha); // Usando o serviço de autenticação
      setMensagem("Login realizado com sucesso!");
      console.log("Resposta da API:", response);
    } catch (error) {
      setMensagem(error);
      console.error("Erro ao fazer login:", error);
    }
  };

  // Função para redirecionar para a tela de alteração de usuário
  const handleHome = () => {
    navigate("/home-site"); // Redireciona para a tela de alteração de usuário
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.titulo}>Bem vindo</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.wrapInput}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <span style={styles.focusInput} data-placeholder="Email"></span>
          </div>
          <div style={styles.wrapInput}>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
              required
            />
            <span style={styles.focusInput} data-placeholder="Senha"></span>
          </div>
          <div style={styles.containerLoginFormBtn}>
            <button onClick={handleHome} style={styles.loginFormBtn}>
              Entrar
            </button>
          </div>
        </form>
        {mensagem && <p style={styles.mensagem}>{mensagem}</p>}
      </div>
    </div>
  );
};

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
  form: {
    width: "100%",
  },
  wrapInput: {
    width: "100%",
    position: "relative",
    borderBottom: "2px solid #adadad",
    marginBottom: "37px",
  },
  input: {
    fontSize: "15px",
    color: "#333",
    lineHeight: "1.2",
    border: "none",
    display: "block",
    width: "100%",
    height: "45px",
    backgroundColor: "transparent",
    padding: "0 5px",
    fontFamily: "'Nunito', sans-serif",
  },
  focusInput: {
    position: "absolute",
    display: "block",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    pointerEvents: "none",
    color: "#adadad",
    fontFamily: "'Nunito', sans-serif",
  },
  containerLoginFormBtn: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: "13px",
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
  },
  mensagem: {
    marginTop: "20px",
    fontSize: "1rem",
    color: "#d9534f",
    textAlign: "center",
  },
};

export default Login;