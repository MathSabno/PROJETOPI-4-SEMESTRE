import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../../services/authService";
import "../../estilos/alterarSenha.css";

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
    <div className="senhaContainer">
      <div className="senhaFormContainer">
        <h1 className="titulo">Alterar Senha</h1>
        <form onSubmit={handleAlteracao} className="form">
          <div className="formGroup">
            <label htmlFor="novaSenha" className="label">
              Nova Senha:
            </label>
            <input
              type="password"
              id="novaSenha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="input"
              placeholder="Nova senha"
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="confirmarSenha" className="label">
              Confirmar Senha:
            </label>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="input"
              placeholder="Confirmar senha"
              required
            />
          </div>
          <button type="submit" className="botao" disabled={carregando}>
            {carregando ? "Carregando..." : "Salvar Alterações"}
          </button>
        </form>
        {/* Botão de Voltar */}
        <div className="containerLoginFormBtn">
          <button
            onClick={() => navigate("/consulta-usuario")} // Redireciona para a consulta de usuários
            className="botao"
          >
            Voltar
          </button>
        </div>
        {erro && <p className="erro">{erro}</p>}
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
};

export default AlterarSenha;