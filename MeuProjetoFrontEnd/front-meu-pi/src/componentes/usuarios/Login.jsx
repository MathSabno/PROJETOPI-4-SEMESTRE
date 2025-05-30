import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "../../estilos/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    document.body.classList.add("login-page-body");
    return () => {
      document.body.classList.remove("login-page-body");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.login(email, senha);

      if (response.status === 2) {
        setMensagem("USUÁRIO INATIVO NO SISTEMA");
        return;
      }

      setMensagem("Login realizado com sucesso!");
      const userGroup = response.grupo;
      navigate("/home-site", { state: { userGroup } });
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMensagem(error.message || "Erro ao fazer login");
    }
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

          {/* Se quiser adicionar um botão de cadastro aqui no futuro */}
          {/* <button type="button" className="login-button cadastro" onClick={() => navigate("/cadastro-admin")}>
            Cadastrar
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
