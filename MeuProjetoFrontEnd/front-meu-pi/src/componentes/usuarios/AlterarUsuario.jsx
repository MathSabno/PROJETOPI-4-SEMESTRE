import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../../services/authService";
import "../../estilos/alterarUsuario.css"; // Importando o arquivo CSS

const AlterarUsuario = () => {
  const { id } = useParams(); // Obtém o ID do usuário da URL
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [grupo, setGrupo] = useState("1"); // 1 = Administrador, 2 = Estoquista
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("")
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Carrega os dados do usuário ao abrir a tela
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarios = await authService.listarUsuarios();
        const usuario = usuarios.find((u) => u.id === parseInt(id));
        if (usuario) {
          setNome(usuario.name);
          setCpf(usuario.cpf);
          setEmail(usuario.email);
          setSenha(usuario.senha);
          setGrupo(usuario.grupo.toString());
          setStatus(usuario.status);
        } else {
          setErro("Usuário não encontrado.");
        }
      } catch (error) {
        setErro("Erro ao carregar dados do usuário.");
      }
    };

    carregarUsuario();
  }, [id]);

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

  const handleAlteracao = async (e) => {
    e.preventDefault();

    // Validações
    if (!nome || !cpf) {
      setErro("Nome e CPF são obrigatórios.");
      return;
    }

    if (!validarCPF(cpf)) {
      setErro("CPF inválido.");
      return;
    }

    // Objeto de usuário para enviar à API
    const usuarioAtualizado = {
      id: parseInt(id),
      name: nome,
      cpf,
      email,
      senha,
      grupo: parseInt(grupo),
      status,
    };

    setCarregando(true);

    console.log(usuarioAtualizado);
    try {
      await authService.atualizarUsuario(usuarioAtualizado); // Usando o serviço
      setMensagem("Usuário atualizado com sucesso!");
      setErro("");
      setTimeout(() => navigate("/consulta-usuario"), 2000); // Redireciona após 2 segundos
    } catch (error) {
      setErro(error.message || "Erro ao atualizar usuário.");
      setMensagem("");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="titulo">Alterar Usuário</h1>
        <form onSubmit={handleAlteracao} className="form">
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
          <div className="containerLoginFormBtn">
            <button type="submit" className="loginFormBtn" disabled={carregando}>
              {carregando ? "Carregando..." : "Salvar Alterações"}
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

export default AlterarUsuario;