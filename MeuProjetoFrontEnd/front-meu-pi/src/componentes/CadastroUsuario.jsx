import React, { useState } from "react";
import authService from "../services/authService"; // Importando o serviço
import { useNavigate } from "react-router-dom"; // Importando useNavigate para redirecionamento
import "../estilos/cadastroUsuario.css"; // Importando o arquivo CSS

const CadastroUsuario = () => {
  const navigate = useNavigate(); // Hook para navegação

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [grupo, setGrupo] = useState("1"); // 1 = Administrador, 2 = Estoquista
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false); // Estado para controlar o carregamento

  // Função para validar o CPF
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  // Função para validar o email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para lidar com o envio do formulário
  const handleCadastro = async (e) => {
    e.preventDefault();

    // Validações
    if (!nome || !cpf || !email || !senha || !confirmarSenha) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }

    if (!validarCPF(cpf)) {
      setErro("CPF inválido.");
      return;
    }

    if (!validarEmail(email)) {
      setErro("Email inválido.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    // Objeto de usuário para enviar à API
    const usuario = {
      name: nome,
      cpf,
      email,
      senha,
      grupo: parseInt(grupo), // Converte para número
      status: 1, // Status Ativo
    };

    console.log("Dados enviados:", usuario); // Log para depuração

    setCarregando(true); // Inicia o carregamento

    try {
      await authService.cadastrarUsuario(usuario); // Usando o serviço
      setMensagem("Usuário cadastrado com sucesso!");
      setErro("");
      setTimeout(() => navigate("/consulta-usuario"), 2000); // Redireciona após 2 segundos
    } catch (error) {
      setErro(error.message || "Erro ao cadastrar usuário.");
      setMensagem("");
    } finally {
      setCarregando(false); // Finaliza o carregamento
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="titulo">Cadastro de Usuário</h1>
        <form onSubmit={handleCadastro} className="form">
          <div className="wrapInput">
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input"
              placeholder="Nome"
              required
            />
            <span className="focusInput" data-placeholder="Nome"></span>
          </div>
          <div className="wrapInput">
            <input
              type="text"
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="input"
              placeholder="CPF"
              required
            />
            <span className="focusInput" data-placeholder="CPF"></span>
          </div>
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
            <select
              id="grupo"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              className="input"
              required
            >
              <option value="1">Administrador</option>
              <option value="2">Estoquista</option>
            </select>
            <span className="focusInput" data-placeholder="Grupo"></span>
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
          <div className="wrapInput">
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="input"
              placeholder="Confirmar senha"
              required
            />
            <span className="focusInput" data-placeholder="Confirmar Senha"></span>
          </div>
          <div className="containerLoginFormBtn">
            <button type="submit" className="loginFormBtn" disabled={carregando}>
              {carregando ? "Carregando..." : "Cadastrar"}
            </button>
          </div>
        </form>
        {/* Botão de Voltar */}
        <div className="containerLoginFormBtn">
          <button
            onClick={() => navigate("/consulta-usuario")} // Redireciona para a consulta de usuários
            className="loginFormBtn"
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

export default CadastroUsuario;