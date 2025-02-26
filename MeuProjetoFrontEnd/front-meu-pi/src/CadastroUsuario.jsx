import React, { useState } from "react";
import authService from "../src/services/authService"; // Importando o serviço
import { useNavigate } from "react-router-dom"; // Importando useNavigate para redirecionamento

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
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.titulo}>Cadastro de Usuário</h1>
        <form onSubmit={handleCadastro} style={styles.form}>
          <div style={styles.wrapInput}>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
              required
            />
            <span style={styles.focusInput} data-placeholder="Nome"></span>
          </div>
          <div style={styles.wrapInput}>
            <input
              type="text"
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              style={styles.input}
              required
            />
            <span style={styles.focusInput} data-placeholder="CPF"></span>
          </div>
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
            <select
              id="grupo"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              style={styles.input}
              required
            >
              <option value="1">Administrador</option>
              <option value="2">Estoquista</option>
            </select>
            <span style={styles.focusInput} data-placeholder="Grupo"></span>
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
          <div style={styles.wrapInput}>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={styles.input}
              required
            />
            <span style={styles.focusInput} data-placeholder="Confirmar Senha"></span>
          </div>
          <div style={styles.containerLoginFormBtn}>
            <button type="submit" style={styles.loginFormBtn} disabled={carregando}>
              {carregando ? "Carregando..." : "Cadastrar"}
            </button>
          </div>
        </form>
        {erro && <p style={styles.erro}>{erro}</p>}
        {mensagem && <p style={styles.mensagem}>{mensagem}</p>}
      </div>
    </div>
  );
};

// Estilos para o formulário
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

export default CadastroUsuario;