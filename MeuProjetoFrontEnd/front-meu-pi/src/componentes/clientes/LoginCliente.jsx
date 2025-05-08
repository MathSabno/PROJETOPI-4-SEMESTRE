import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "../../estilos/loginCliente.css";

const LoginCliente = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Efeito para adicionar/remover a classe do body
  useEffect(() => {
    document.body.classList.add("login-page-body");
    return () => {
      document.body.classList.remove("login-page-body");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.loginCliente(email, senha);
      const userNome = response.nome;
      const userId = response.id;

      setMensagem("Login realizado com sucesso!");
      console.log("Resposta da API:", response);

      navigate("/listagem-de-produtos-logado", {
        state: { userId, userNome },
      });
    } catch (error) {
      setMensagem(error.message || "Erro ao fazer login");
      console.error("Erro ao fazer login:", error);
    }
  };

  const redirecionarCadastro = () => {
    navigate("/cadastro-cliente");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          {mensagem && <p className="mensagem">{mensagem}</p>}
          <button type="submit" className="login-button">
            Entrar
          </button>
          <button
            type="button"
            className="login-button cadastro"
            onClick={redirecionarCadastro}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginCliente;