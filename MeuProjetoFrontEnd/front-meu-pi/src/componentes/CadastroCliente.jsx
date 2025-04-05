import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../estilos/cadastroCliente.css";

const CadastroCliente = () => {
  const navigate = useNavigate();

  const [cliente, setCliente] = useState({
    nomeCompleto: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    genero: "",
    senha: "",
    confirmarSenha: "",
    enderecoFaturamento: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: ""
    },
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
      enderecoFaturamento: {
        ...prev.enderecoFaturamento,
        [name]: value
      }
    }));
  };

  const handleEnderecoEntregaChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newEnderecos = [...cliente.enderecosEntrega];
    
    if (name === "copiarFaturamento" && checked) {
      newEnderecos[index] = { ...cliente.enderecoFaturamento, copiarFaturamento: true };
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
          enderecoFaturamento: {
            ...prev.enderecoFaturamento,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf
          }
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
    // Implementação da validação de CPF
    // (adicionar lógica de validação real aqui)
    return cpf.length === 11;
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
    if (!validarNome(cliente.nomeCompleto)) {
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

    if (!cliente.enderecoFaturamento.cep || 
        !cliente.enderecoFaturamento.logradouro || 
        !cliente.enderecoFaturamento.numero || 
        !cliente.enderecoFaturamento.bairro || 
        !cliente.enderecoFaturamento.cidade || 
        !cliente.enderecoFaturamento.uf) {
      setErro("Endereço de faturamento incompleto");
      return;
    }

    setCarregando(true);

    try {
      await authService.cadastrarCliente(cliente);
      setMensagem("Cadastro realizado com sucesso! Redirecionando para login...");
      setTimeout(() => navigate("/login"), 2000);
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
              <label htmlFor="nomeCompleto" className="label">
                Nome Completo*:
              </label>
              <input
                type="text"
                id="nomeCompleto"
                name="nomeCompleto"
                value={cliente.nomeCompleto}
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
              <label htmlFor="dataNascimento" className="label">
                Data de Nascimento*:
              </label>
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={cliente.dataNascimento}
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
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Prefiro não informar</option>
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
                name="cep"
                value={cliente.enderecoFaturamento.cep}
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
                name="logradouro"
                value={cliente.enderecoFaturamento.logradouro}
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
                name="numero"
                value={cliente.enderecoFaturamento.numero}
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
                name="complemento"
                value={cliente.enderecoFaturamento.complemento}
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
                name="bairro"
                value={cliente.enderecoFaturamento.bairro}
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
                name="cidade"
                value={cliente.enderecoFaturamento.cidade}
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
                name="uf"
                value={cliente.enderecoFaturamento.uf}
                onChange={handleEnderecoFaturamentoChange}
                className="input"
                placeholder="Estado"
                required
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
            onClick={() => navigate("/login")}
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

