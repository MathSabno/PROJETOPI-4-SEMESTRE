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
export default AlterarSenha;