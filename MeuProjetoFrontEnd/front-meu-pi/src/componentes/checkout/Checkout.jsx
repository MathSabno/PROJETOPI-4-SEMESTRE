import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import "../../estilos/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [enderecos, setEnderecos] = useState([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    console.log("Dados recebidos no Carrinho:", location.state);
  }, [location.state]);

  useEffect(() => {
    const carregarEnderecosCliente = async () => {
      try {
        if (!userId) {
          throw new Error("Usuário não identificado");
        }

        const clientes = await authService.listarClientes();
        const cliente = clientes.find(c => c.id === parseInt(userId));

        if (!cliente) {
          throw new Error("Cliente não encontrado");
        }

        const enderecosCliente = cliente.enderecosEntrega || [];

        // Adiciona apelido e marca o endereço principal
        const enderecosFormatados = enderecosCliente.map((endereco, index) => ({
          ...endereco,
          id: endereco.id || index,
          apelido: `Endereço ${index + 1}`,
          principal: endereco.isPadrao || false,
          cidade: endereco.cidade || endereco.localidade,
          uf: endereco.uf || endereco.estado
        }));

        setEnderecos(enderecosFormatados);

        // Seleciona o endereço principal por padrão
        const enderecoPadrao = enderecosFormatados.find(e => e.principal) ||
          (enderecosFormatados.length > 0 ? enderecosFormatados[0] : null);
        setEnderecoSelecionado(enderecoPadrao?.id || null);

      } catch (error) {
        setErro(error.message || "Erro ao carregar endereços");
      } finally {
        setCarregando(false);
      }
    };

    carregarEnderecosCliente();
  }, [userId]);

  const handleSelecionarEndereco = (id) => {
    setEnderecoSelecionado(id);
  };

  const handleConfirmarEndereco = () => {
    if (!enderecoSelecionado) {
      setErro("Selecione um endereço de entrega");
      return;
    }

    const enderecoSelecionadoObj = enderecos.find(e => e.id === enderecoSelecionado);

    // Validação adicional dos campos do endereço
    if (!enderecoSelecionadoObj.logradouro || !enderecoSelecionadoObj.numero ||
      !enderecoSelecionadoObj.bairro || !enderecoSelecionadoObj.cidade ||
      !enderecoSelecionadoObj.uf || !enderecoSelecionadoObj.cep) {
      setErro("O endereço selecionado está incompleto");
      return;
    }

    navigate("/checkout-carrinho", {
      state: {
        ...location.state, // Mantém todos os dados anteriores
        enderecoEntrega: enderecoSelecionadoObj,
        userId: userId
      }
    });
  };

  const handleAdicionarEndereco = () => {
    navigate("/alterar-dados-cliente", {
      state: {
        userId: userId,
        adicionarEndereco: true
      }
    });
  };

  if (carregando) {
    return <div className="enderecoContainer">Carregando endereços...</div>;
  }

  if (erro) {
    return <div className="enderecoContainer">
      <div className="enderecoFormContainer">
        <p className="erro">{erro}</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    </div>;
  }

  return (
    <div className="enderecoContainer">
      <div className="enderecoFormContainer">
        <h1 className="enderecoTitulo">Selecione o endereço de entrega</h1>

        {enderecos.length === 0 ? (
          <div className="semEnderecos">
            <p>Nenhum endereço cadastrado</p>
          </div>
        ) : (
          <div className="enderecoLista">
            {enderecos.map((endereco) => (
              <div
                key={endereco.id}
                className={`enderecoItem ${endereco.principal ? 'principal' : ''}`}
                onClick={() => handleSelecionarEndereco(endereco.id)}
              >
                <div className="enderecoRadio">
                  <input
                    type="radio"
                    id={`endereco-${endereco.id}`}
                    name="enderecoEntrega"
                    checked={enderecoSelecionado === endereco.id}
                    onChange={() => handleSelecionarEndereco(endereco.id)}
                  />
                  <label htmlFor={`endereco-${endereco.id}`}></label>
                </div>

                <div className="enderecoInfo">
                  <h3>
                    {endereco.apelido}
                    {endereco.principal && <span className="enderecoTag">Principal</span>}
                  </h3>
                  <p>{endereco.logradouro}, {endereco.numero} {endereco.complemento && `- ${endereco.complemento}`}</p>
                  <p>{endereco.bairro}, {endereco.cidade} - {endereco.uf}</p>
                  <p>CEP: {endereco.cep}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="enderecoBtnPrimario"
          onClick={handleConfirmarEndereco}
          disabled={!enderecoSelecionado}
        >
          Confirmar Endereço
        </button>

        <button
          className="enderecoBtnSecundario"
          onClick={handleAdicionarEndereco}
        >
          Adicionar Novo Endereço
        </button>
      </div>
    </div>
  );
};

export default Checkout;