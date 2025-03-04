import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../services/authService";

const AlterarSenha = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleAlteracao = async (e) => {
    e.preventDefault();

    // Validações
    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    console.log(novaSenha);

    try {
      // Envia a nova senha para o backend
      await authService.alterarSenha(id, novaSenha);
      setMensagem("Senha alterada com sucesso!");
      setErro("");
      setTimeout(() => navigate("/consulta-usuario"), 2000); // Redireciona após 2 segundos
    } catch (error) {
      setErro(error.message || "Erro ao alterar a senha.");
      setMensagem("");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.titulo}>Alterar Senha</h1>
        <form onSubmit={handleAlteracao} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="novaSenha" style={styles.label}>
              Nova Senha:
            </label>
            <input
              type="password"
              id="novaSenha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={styles.input}
              placeholder="Nova senha"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="confirmarSenha" style={styles.label}>
              Confirmar Senha:
            </label>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={styles.input}
              placeholder="Confirmar senha"
              required
            />
          </div>
          <button type="submit" style={styles.botao} disabled={carregando}>
            {carregando ? "Carregando..." : "Salvar Alterações"}
          </button>
        </form>
        {/* Botão de Voltar */}
        <div style={styles.containerLoginFormBtn}>
          <button
            onClick={() => navigate("/consulta-usuario")} // Redireciona para a consulta de usuários
            style={styles.botao}
          >
            Voltar
          </button>
        </div>
        {erro && <p style={styles.erro}>{erro}</p>}
        {mensagem && <p style={styles.mensagem}>{mensagem}</p>}
      </div>
    </div>
  );
};

// Estilos (mantidos iguais)
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Arial', sans-serif",
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
    fontSize: "2rem",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    marginBottom: "8px",
    fontSize: "1rem",
    color: "#555",
    fontWeight: "500",
  },
  input: {
    width: "94%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    color: "#333",
    transition: "border-color 0.3s ease",
    "&:focus": {
      borderColor: "#007bff",
      outline: "none",
    },
  },
  botao: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  erro: {
    marginTop: "20px",
    fontSize: "1rem",
    color: "#d9534f",
    textAlign: "center",
  },
  mensagem: {
    marginTop: "20px",
    fontSize: "1rem",
    color: "#28a745",
    textAlign: "center",
  },
};

export default AlterarSenha;