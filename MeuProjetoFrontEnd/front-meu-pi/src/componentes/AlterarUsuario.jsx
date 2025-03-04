import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../services/authService";

const AlterarUsuario = () => {
  const { id } = useParams(); // Obtém o ID do usuário da URL
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [grupo, setGrupo] = useState("1"); // 1 = Administrador, 2 = Estoquista
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
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
      status: 1, // Adicione o status (1 = ativo, 2 = inativo)
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
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.titulo}>Alterar Usuário</h1>
        <form onSubmit={handleAlteracao} style={styles.form}>
          <div style={styles.wrapInput}>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
              placeholder="Nome"
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
              placeholder="CPF"
              required
            />
            <span style={styles.focusInput} data-placeholder="CPF"></span>
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
          <div style={styles.containerLoginFormBtn}>
            <button type="submit" style={styles.loginFormBtn} disabled={carregando}>
              {carregando ? "Carregando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
        {/* Botão de Voltar */}
        <div style={styles.containerLoginFormBtn}>
          <button
            onClick={() => navigate("/consulta-usuario")} // Redireciona para a consulta de usuários
            style={styles.loginFormBtn}
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

export default AlterarUsuario;