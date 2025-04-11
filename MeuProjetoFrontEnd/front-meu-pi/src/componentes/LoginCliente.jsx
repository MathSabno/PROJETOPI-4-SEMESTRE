  import React, { useState } from "react";
  import authService from "../services/authService"; // Importando o serviço de autenticação
  import { useNavigate } from "react-router-dom"; // Importando useNavigate para redirecionamento
  import "../estilos/login.css"; // Importando o arquivo CSS

  const LoginCliente = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    // No arquivo LoginCliente.js
  const handleLogin = async (e) => {
      e.preventDefault();
      
      try {
        const response = await authService.loginCliente(email, senha);    
    
        const userNome = response.name; 
        const userId = response.id;
    
        setMensagem("Login realizado com sucesso!");
        console.log("Resposta da API:", response);
      
        navigate("/listagem-de-produtos-logado", { 
          state: { 
            userNome: userNome,
            userId: userId
          } 
        }); 
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
              <span className="focusInput"></span>
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
              <span className="focusInput"></span>
            </div>
            <div className="containerLoginFormBtn">
              <button type="submit" className="loginFormBtn">
                Entrar
              </button>
              <button type="submit" className="loginFormBtn" onClick={() => navigate("/cadastro-cliente")}>
                Cadastrar
              </button>
            </div>
          </form>
          {mensagem && <p className="mensagem">{mensagem}</p>}
        </div>
      </div>
    );
  };

  export default LoginCliente;