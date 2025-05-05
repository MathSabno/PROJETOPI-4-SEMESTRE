import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../estilos/cadastroCliente.css";

const CadastroCliente = () => {
  const navigate = useNavigate();

  const [cliente, setCliente] = useState({
    name: "",
    email: "",
    cpf: "",
    dt_nascimento: "",
    genero: "",
    senha: "",
    confirmarSenha: "",
    cepFaturamento: "",
    logradouroFaturamento: "",
    numeroFaturamento: "",
    complementoFaturamento: "",
    bairroFaturamento: "",
    cidadeFaturamento: "",
    ufFaturamento: "",
    enderecosEntrega: [{
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      copiarFaturamento: true
    }]
  });

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleEnderecoFaturamentoChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnderecoEntregaChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newEnderecos = [...cliente.enderecosEntrega];

    if (name === "copiarFaturamento" && checked) {
      newEnderecos[index] = {
        cep: cliente.cepFaturamento,
        logradouro: cliente.logradouroFaturamento,
        numero: cliente.numeroFaturamento,
        complemento: cliente.complementoFaturamento,
        bairro: cliente.bairroFaturamento,
        cidade: cliente.cidadeFaturamento,
        uf: cliente.ufFaturamento,
        copiarFaturamento: true
      };
    } else if (type === "checkbox") {
      newEnderecos[index] = { ...newEnderecos[index], [name]: checked };
    } else {
      newEnderecos[index] = { ...newEnderecos[index], [name]: value };
    }

    setCliente(prev => ({ ...prev, enderecosEntrega: newEnderecos }));
  };

  const buscarCep = async (cep, tipoEndereco, index = null) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      if (tipoEndereco === "faturamento") {
        setCliente(prev => ({
          ...prev,
          logradouroFaturamento: data.logradouro,
          bairroFaturamento: data.bairro,
          cidadeFaturamento: data.localidade,
          ufFaturamento: data.uf
        }));
      } else {
        const newEnderecos = [...cliente.enderecosEntrega];
        newEnderecos[index] = {
          ...newEnderecos[index],
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf
        };
        setCliente(prev => ({ ...prev, enderecosEntrega: newEnderecos }));
      }
    } catch (error) {
      setErro("CEP inválido ou não encontrado");
    }
  };

  const adicionarEnderecoEntrega = () => {
    setCliente(prev => ({
      ...prev,
      enderecosEntrega: [
        ...prev.enderecosEntrega,
        {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
          copiarFaturamento: false
        }
      ]
    }));
  };

  const removerEnderecoEntrega = (index) => {
    if (cliente.enderecosEntrega.length <= 1) return;
    const newEnderecos = cliente.enderecosEntrega.filter((_, i) => i !== index);
    setCliente(prev => ({ ...prev, enderecosEntrega: newEnderecos }));
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const validarNome = (nome) => {
    const partes = nome.trim().split(/\s+/);
    return partes.length >= 2 && partes.every(part => part.length >= 3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    // Validações
    if (!validarNome(cliente.name)) {
      setErro("O nome deve conter pelo menos 2 palavras com mínimo de 3 letras cada");
      return;
    }

    if (!validarCPF(cliente.cpf)) {
      setErro("CPF inválido");
      return;
    }

    if (cliente.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (cliente.senha !== cliente.confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    if (!cliente.cepFaturamento ||
      !cliente.logradouroFaturamento ||
      !cliente.numeroFaturamento ||
      !cliente.bairroFaturamento ||
      !cliente.cidadeFaturamento ||
      !cliente.ufFaturamento) {
      setErro("Endereço de faturamento incompleto");
      return;
    }

    // Validar endereços de entrega
    for (const endereco of cliente.enderecosEntrega) {
      if (!endereco.copiarFaturamento &&
        (!endereco.cep ||
          !endereco.logradouro ||
          !endereco.numero ||
          !endereco.bairro ||
          !endereco.cidade ||
          !endereco.uf)) {
        setErro("Todos os endereços de entrega devem estar completos");
        return;
      }
    }

    setCarregando(true);

    try {
      const generoMap = {
        Masculino: 1,
        Feminino: 2,
        Outro: 3
      };

      const dadosCliente = {
        ...cliente,
        genero: generoMap[cliente.genero] || 3,
        dt_nascimento: new Date(cliente.dt_nascimento).toISOString(),
        enderecosEntrega: cliente.enderecosEntrega.map(endereco => ({
          ...(endereco.copiarFaturamento ? {
            cep: cliente.cepFaturamento,
            logradouro: cliente.logradouroFaturamento,
            numero: cliente.numeroFaturamento,
            complemento: cliente.complementoFaturamento,
            bairro: cliente.bairroFaturamento,
            cidade: cliente.cidadeFaturamento,
            uf: cliente.ufFaturamento
          } : {
            cep: endereco.cep,
            logradouro: endereco.logradouro,
            numero: endereco.numero,
            complemento: endereco.complemento,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            uf: endereco.uf
          })
        }))
      };


      delete dadosCliente.confirmarSenha;

      await authService.cadastrarCliente(dadosCliente);
      setMensagem("Cadastro realizado com sucesso! Redirecionando para login...");
      setTimeout(() => navigate("/login-cliente"), 2000);
    } catch (error) {
      setErro(error.message || "Erro ao cadastrar cliente. Verifique se o email ou CPF já estão cadastrados.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastroContainer">
      <div className="cadastroFormContainer">
        <h1 className="titulo">Cadastro de Cliente</h1>
        <form onSubmit={handleSubmit} className="form">
          {/* Dados Pessoais */}
          <div className="formSection">
            <h2>Dados Pessoais</h2>
            <div className="formGroup">
              <label htmlFor="name" className="label">
                Nome Completo*:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={cliente.name}
                onChange={handleChange}
                className="input"
                placeholder="Nome e sobrenome"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="email" className="label">
                Email*:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={cliente.email}
                onChange={handleChange}
                className="input"
                placeholder="Seu email"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="cpf" className="label">
                CPF*:
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={cliente.cpf}
                onChange={handleChange}
                className="input"
                placeholder="Somente números"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="dt_nascimento" className="label">
                Data de Nascimento*:
              </label>
              <input
                type="date"
                id="dt_nascimento"
                name="dt_nascimento"
                value={cliente.dt_nascimento}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="genero" className="label">
                Gênero*:
              </label>
              <select
                id="genero"
                name="genero"
                value={cliente.genero}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Prefiro não informar</option>
              </select>
            </div>
            <div className="formGroup">
              <label htmlFor="senha" className="label">
                Senha*:
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={cliente.senha}
                onChange={handleChange}
                className="input"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="confirmarSenha" className="label">
                Confirmar Senha*:
              </label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={cliente.confirmarSenha}
                onChange={handleChange}
                className="input"
                placeholder="Confirme sua senha"
                required
              />
            </div>
          </div>

          {/* Endereço de Faturamento */}
          <div className="formSection">
            <h2>Endereço de Faturamento*</h2>
            <div className="formGroup">
              <label htmlFor="cepFaturamento" className="label">
                CEP*:
              </label>
              <input
                type="text"
                id="cepFaturamento"
                name="cepFaturamento"
                value={cliente.cepFaturamento}
                onChange={handleEnderecoFaturamentoChange}
                onBlur={(e) => buscarCep(e.target.value, "faturamento")}
                className="input"
                placeholder="Digite o CEP"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="logradouroFaturamento" className="label">
                Logradouro*:
              </label>
              <input
                type="text"
                id="logradouroFaturamento"
                name="logradouroFaturamento"
                value={cliente.logradouroFaturamento}
                onChange={handleEnderecoFaturamentoChange}
                className="input"
                placeholder="Rua/Avenida"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="numeroFaturamento" className="label">
                Número*:
              </label>
              <input
                type="text"
                id="numeroFaturamento"
                name="numeroFaturamento"
                value={cliente.numeroFaturamento}
                onChange={handleEnderecoFaturamentoChange}
                className="input"
                placeholder="Número"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="complementoFaturamento" className="label">
                Complemento:
              </label>
              <input
                type="text"
                id="complementoFaturamento"
                name="complementoFaturamento"
                value={cliente.complementoFaturamento}
                onChange={handleEnderecoFaturamentoChange}
                className="input"
                placeholder="Apto/Casa"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="bairroFaturamento" className="label">
                Bairro*:
              </label>
              <input
                type="text"
                id="bairroFaturamento"
                name="bairroFaturamento"
                value={cliente.bairroFaturamento}
                onChange={handleEnderecoFaturamentoChange}
                className="input"
                placeholder="Bairro"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="cidadeFaturamento" className="label">
                Cidade*:
              </label>
              <input
                type="text"
                id="cidadeFaturamento"
                name="cidadeFaturamento"
                value={cliente.cidadeFaturamento}
                onChange={handleEnderecoFaturamentoChange}
                className="input"
                placeholder="Cidade"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="ufFaturamento" className="label">
                UF*:
              </label>
              <input
                type="text"
                id="ufFaturamento"
                name="ufFaturamento"
                value={cliente.ufFaturamento}
                onChange={handleEnderecoFaturamentoChange}
                className="input"
                placeholder="Estado"
                required
                maxLength={2}
              />
            </div>
          </div>

          {/* Endereços de Entrega */}
          <div className="formSection">
            <h2>Endereços de Entrega*</h2>
            {cliente.enderecosEntrega.map((endereco, index) => (
              <div key={index} className="enderecoEntregaGroup">
                <h3>Endereço de Entrega {index + 1}</h3>
                <div className="formGroup">
                  <label>
                    <input
                      type="checkbox"
                      name="copiarFaturamento"
                      checked={endereco.copiarFaturamento}
                      onChange={(e) => handleEnderecoEntregaChange(index, e)}
                    />
                    Copiar do endereço de faturamento
                  </label>
                </div>

                {!endereco.copiarFaturamento && (
                  <>
                    <div className="formGroup">
                      <label htmlFor={`cepEntrega${index}`} className="label">
                        CEP*:
                      </label>
                      <input
                        type="text"
                        id={`cepEntrega${index}`}
                        name="cep"
                        value={endereco.cep}
                        onChange={(e) => handleEnderecoEntregaChange(index, e)}
                        onBlur={(e) => buscarCep(e.target.value, "entrega", index)}
                        className="input"
                        placeholder="Digite o CEP"
                        required
                      />
                    </div>
                    <div className="formGroup">
                      <label htmlFor={`logradouroEntrega${index}`} className="label">
                        Logradouro*:
                      </label>
                      <input
                        type="text"
                        id={`logradouroEntrega${index}`}
                        name="logradouro"
                        value={endereco.logradouro}
                        onChange={(e) => handleEnderecoEntregaChange(index, e)}
                        className="input"
                        placeholder="Rua/Avenida"
                        required
                      />
                    </div>
                    <div className="formGroup">
                      <label htmlFor={`numeroEntrega${index}`} className="label">
                        Número*:
                      </label>
                      <input
                        type="text"
                        id={`numeroEntrega${index}`}
                        name="numero"
                        value={endereco.numero}
                        onChange={(e) => handleEnderecoEntregaChange(index, e)}
                        className="input"
                        placeholder="Número"
                        required
                      />
                    </div>
                    <div className="formGroup">
                      <label htmlFor={`complementoEntrega${index}`} className="label">
                        Complemento:
                      </label>
                      <input
                        type="text"
                        id={`complementoEntrega${index}`}
                        name="complemento"
                        value={endereco.complemento}
                        onChange={(e) => handleEnderecoEntregaChange(index, e)}
                        className="input"
                        placeholder="Apto/Casa"
                      />
                    </div>
                    <div className="formGroup">
                      <label htmlFor={`bairroEntrega${index}`} className="label">
                        Bairro*:
                      </label>
                      <input
                        type="text"
                        id={`bairroEntrega${index}`}
                        name="bairro"
                        value={endereco.bairro}
                        onChange={(e) => handleEnderecoEntregaChange(index, e)}
                        className="input"
                        placeholder="Bairro"
                        required
                      />
                    </div>
                    <div className="formGroup">
                      <label htmlFor={`cidadeEntrega${index}`} className="label">
                        Cidade*:
                      </label>
                      <input
                        type="text"
                        id={`cidadeEntrega${index}`}
                        name="cidade"
                        value={endereco.cidade}
                        onChange={(e) => handleEnderecoEntregaChange(index, e)}
                        className="input"
                        placeholder="Cidade"
                        required
                      />
                    </div>
                    <div className="formGroup">
                      <label htmlFor={`ufEntrega${index}`} className="label">
                        UF*:
                      </label>
                      <input
                        type="text"
                        id={`ufEntrega${index}`}
                        name="uf"
                        value={endereco.uf}
                        onChange={(e) => handleEnderecoEntregaChange(index, e)}
                        className="input"
                        placeholder="Estado"
                        required
                        maxLength={2}
                      />
                    </div>
                  </>
                )}

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removerEnderecoEntrega(index)}
                    className="botaoRemover"
                  >
                    Remover Endereço
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={adicionarEnderecoEntrega}
              className="botaoAdicionar"
            >
              Adicionar outro endereço de entrega
            </button>
          </div>

          <button type="submit" className="botao" disabled={carregando}>
            {carregando ? "Carregando..." : "Cadastrar"}
          </button>
        </form>

        {/* Botão de Voltar */}
        <div className="containerLoginFormBtn">
          <button
            onClick={() => navigate("/login-cliente")}
            className="botao"
          >
            Voltar para Login
          </button>
        </div>

        {erro && <p className="erro">{erro}</p>}
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
};

export default CadastroCliente;