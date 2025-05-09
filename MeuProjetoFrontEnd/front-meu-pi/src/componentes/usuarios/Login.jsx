import React, { useState } from "react";
import authService from "../../services/authService"; // Importando o serviço de autenticação
import { useNavigate } from "react-router-dom"; // Importando useNavigate para redirecionamento
import "../../estilos/login.css"; // Importando o arquivo CSS

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.login(email, senha); // Usando o serviço de autenticação

      // Verifica o status do usuário
      if (response.status === 2) {
        setMensagem("USUÁRIO INATIVO NO SISTEMA");
        return; // Impede o login e interrompe a execução da função
      }

      setMensagem("Login realizado com sucesso!");
      console.log("Resposta da API:", response);

      // Extrai o grupo do usuário da resposta da API
      const userGroup = response.grupo; // Certifica de que a API retorna o grupo

      // Redireciona para a página home após o login bem-sucedido
      navigate("/home-site", { state: { userGroup } }); // Passa o grupo como estado
    } catch (error) {
      setMensagem(error.message || "Erro ao fazer login");
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="titulo">Bem vindo</h1>
        <form onSubmit={handleLogin} className="form">
          <div className="wrapInput">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="E-mail"
              required
            />
            <span className="focusInput" data-placeholder="Email"></span>
          </div>
          <div className="wrapInput">
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input"
              placeholder="Senha"
              required
            />
            <span className="focusInput" data-placeholder="Senha"></span>
          </div>
          <div className="containerLoginFormBtn">
            <button type="submit" className="loginFormBtn">
              Entrar
            </button>
          </div>
        </form>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
};

export default Login;