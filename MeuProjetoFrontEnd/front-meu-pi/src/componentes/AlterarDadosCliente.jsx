import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../estilos/alterarDadosCliente.css";

const AlterarDadosCliente = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    genero: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
    enderecosEntrega: []
  });
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Carrega os dados do cliente ao montar o componente
  useEffect(() => {
    const carregarDadosCliente = async () => {
      try {
        setCarregando(true);
        const dadosCliente = await authService.obterDadosCliente();
        setCliente({
          ...dadosCliente,
          senhaAtual: "",
          novaSenha: "",
          confirmarSenha: ""
        });
      } catch (error) {
        setErro("Erro ao carregar dados do cliente");
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosCliente();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleEnderecoEntregaChange = (index, e) => {
    const { name, value } = e.target;
    const newEnderecos = [...cliente.enderecosEntrega];
    newEnderecos[index] = { ...newEnderecos[index], [name]: value };
    setCliente(prev => ({ ...prev, enderecosEntrega: newEnderecos }));
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
          uf: ""
        }
      ]
    }));
  };

  const removerEnderecoEntrega = (index) => {
    const newEnderecos = cliente.enderecosEntrega.filter((_, i) => i !== index);
    setCliente(prev => ({ ...prev, enderecosEntrega: newEnderecos }));
  };

  const buscarCep = async (cep, index) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        throw new Error("CEP não encontrado");
      }
      
      const newEnderecos = [...cliente.enderecosEntrega];
      newEnderecos[index] = {
        ...newEnderecos[index],
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf
      };
      setCliente(prev => ({ ...prev, enderecosEntrega: newEnderecos }));
    } catch (error) {
      setErro("CEP inválido ou não encontrado");
    }
  };

  const validarSenha = () => {
    if (cliente.novaSenha && cliente.novaSenha.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres";
    }
    if (cliente.novaSenha !== cliente.confirmarSenha) {
      return "As novas senhas não coincidem";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    // Validação de senha
    const erroSenha = validarSenha();
    if (erroSenha) {
      setErro(erroSenha);
      return;
    }

    setCarregando(true);

    try {
      await authService.atualizarDadosCliente(cliente);
      setMensagem("Dados atualizados com sucesso!");
      setTimeout(() => navigate("/perfil"), 2000);
    } catch (error) {
      setErro(error.message || "Erro ao atualizar dados");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="dadosContainer">
      <div className="dadosFormContainer">
        <h1 className="titulo">Alterar Meus Dados</h1>
        <form onSubmit={handleSubmit} className="form">
          {/* Dados Pessoais */}
          <div className="formSection">
            <h2>Dados Pessoais</h2>
            <div className="formGroup">
              <label htmlFor="nomeCompleto" className="label">
                Nome Completo:
              </label>
              <input
                type="text"
                id="nomeCompleto"
                name="nomeCompleto"
                value={cliente.nomeCompleto}
                onChange={handleChange}
                className="input"
                placeholder="Seu nome completo"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="dataNascimento" className="label">
                Data de Nascimento:
              </label>
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={cliente.dataNascimento}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="genero" className="label">
                Gênero:
              </label>
              <select
                id="genero"
                name="genero"
                value={cliente.genero}
                onChange={handleChange}
                className="input"
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
          </div>

          {/* Alteração de Senha */}
          <div className="formSection">
            <h2>Alteração de Senha</h2>
            <div className="formGroup">
              <label htmlFor="senhaAtual" className="label">
                Senha Atual:
              </label>
              <input
                type="password"
                id="senhaAtual"
                name="senhaAtual"
                value={cliente.senhaAtual}
                onChange={handleChange}
                className="input"
                placeholder="Digite sua senha atual"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="novaSenha" className="label">
                Nova Senha:
              </label>
              <input
                type="password"
                id="novaSenha"
                name="novaSenha"
                value={cliente.novaSenha}
                onChange={handleChange}
                className="input"
                placeholder="Digite a nova senha (mínimo 6 caracteres)"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="confirmarSenha" className="label">
                Confirmar Nova Senha:
              </label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={cliente.confirmarSenha}
                onChange={handleChange}
                className="input"
                placeholder="Confirme a nova senha"
              />
            </div>
          </div>

          {/* Endereços de Entrega */}
          <div className="formSection">
            <h2>Endereços de Entrega</h2>
            {cliente.enderecosEntrega.map((endereco, index) => (
              <div key={index} className="enderecoEntregaGroup">
                <h3>Endereço de Entrega {index + 1}</h3>
                <div className="formGroup">
                  <label htmlFor={`cepEntrega${index}`} className="label">
                    CEP:
                  </label>
                  <input
                    type="text"
                    id={`cepEntrega${index}`}
                    name="cep"
                    value={endereco.cep}
                    onChange={(e) => handleEnderecoEntregaChange(index, e)}
                    onBlur={(e) => buscarCep(e.target.value, index)}
                    className="input"
                    placeholder="Digite o CEP"
                  />
                </div>
                <div className="formGroup">
                  <label htmlFor={`logradouroEntrega${index}`} className="label">
                    Logradouro:
                  </label>
                  <input
                    type="text"
                    id={`logradouroEntrega${index}`}
                    name="logradouro"
                    value={endereco.logradouro}
                    onChange={(e) => handleEnderecoEntregaChange(index, e)}
                    className="input"
                    placeholder="Rua/Avenida"
                  />
                </div>
                <div className="formGroup">
                  <label htmlFor={`numeroEntrega${index}`} className="label">
                    Número:
                  </label>
                  <input
                    type="text"
                    id={`numeroEntrega${index}`}
                    name="numero"
                    value={endereco.numero}
                    onChange={(e) => handleEnderecoEntregaChange(index, e)}
                    className="input"
                    placeholder="Número"
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
                    Bairro:
                  </label>
                  <input
                    type="text"
                    id={`bairroEntrega${index}`}
                    name="bairro"
                    value={endereco.bairro}
                    onChange={(e) => handleEnderecoEntregaChange(index, e)}
                    className="input"
                    placeholder="Bairro"
                  />
                </div>
                <div className="formGroup">
                  <label htmlFor={`cidadeEntrega${index}`} className="label">
                    Cidade:
                  </label>
                  <input
                    type="text"
                    id={`cidadeEntrega${index}`}
                    name="cidade"
                    value={endereco.cidade}
                    onChange={(e) => handleEnderecoEntregaChange(index, e)}
                    className="input"
                    placeholder="Cidade"
                  />
                </div>
                <div className="formGroup">
                  <label htmlFor={`ufEntrega${index}`} className="label">
                    UF:
                  </label>
                  <input
                    type="text"
                    id={`ufEntrega${index}`}
                    name="uf"
                    value={endereco.uf}
                    onChange={(e) => handleEnderecoEntregaChange(index, e)}
                    className="input"
                    placeholder="Estado"
                  />
                </div>
                {cliente.enderecosEntrega.length > 1 && (
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
              Adicionar Endereço de Entrega
            </button>
          </div>

          <button type="submit" className="botao" disabled={carregando}>
            {carregando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>

        <div className="containerLoginFormBtn">
          <button
            onClick={() => navigate("/perfil")}
            className="botao"
          >
            Voltar para Perfil
          </button>
        </div>

        {erro && <p className="erro">{erro}</p>}
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
};

export default AlterarDadosCliente;