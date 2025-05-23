import React, { useState } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import styles from "../../estilos/cadastroUsuario.module.css";

const CadastroUsuario = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [grupo, setGrupo] = useState("1");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

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

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCadastro = async (e) => {
    e.preventDefault();

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

    const usuario = {
      name: nome,
      cpf,
      email,
      senha,
      grupo: parseInt(grupo),
      status: 1,
    };

    setCarregando(true);

    try {
      await authService.cadastrarUsuario(usuario);
      setMensagem("Usuário cadastrado com sucesso!");
      setErro("");
      setTimeout(() => navigate("/consulta-usuario"), 2000);
    } catch (error) {
      setErro(error.message || "Erro ao cadastrar usuário.");
      setMensagem("");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.titulo}>Cadastro de Usuário</h1>
        <form onSubmit={handleCadastro} className={styles.form}>
          <div className={styles.wrapInput}>
            <input
              className={styles.input}
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
            />
            <span className={styles.focusInput} data-placeholder="Nome"></span>
          </div>

          <div className={styles.wrapInput}>
            <input
              className={styles.input}
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="CPF"
            />
            <span className={styles.focusInput} data-placeholder="CPF"></span>
          </div>

          <div className={styles.wrapInput}>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
            />
            <span className={styles.focusInput} data-placeholder="Email"></span>
          </div>

          <div className={styles.wrapInput}>
            <select
              className={styles.input}
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
            >
              <option value="1">Administrador</option>
              <option value="2">Estoquista</option>
            </select>
            <span className={styles.focusInput} data-placeholder="Grupo"></span>
          </div>

          <div className={styles.wrapInput}>
            <input
              className={styles.input}
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
            />
            <span className={styles.focusInput} data-placeholder="Senha"></span>
          </div>

          <div className={styles.wrapInput}>
            <input
              className={styles.input}
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirmar senha"
            />
            <span className={styles.focusInput} data-placeholder="Confirmar Senha"></span>
          </div>

          <div className={styles.containerLoginFormBtn}>
            <button
              type="submit"
              className={styles.loginFormBtn}
              disabled={carregando}
            >
              {carregando ? "Carregando..." : "Cadastrar"}
            </button>
          </div>
        </form>

        <div className={styles.containerLoginFormBtn}>
          <button
            type="button"
            className={styles.loginFormBtn}
            onClick={() => navigate("/consulta-usuario")}
          >
            Voltar
          </button>
        </div>

        {erro && <p className={styles.erro}>{erro}</p>}
        {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
      </div>
    </div>
  );
};

export default CadastroUsuario;
