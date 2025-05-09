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
    const carregarEnderecosCliente = async () => {
      if (!userId) {
        setErro("Usuário não identificado.");
        setCarregando(false);
        return;
      }

      try {
        const clientes = await authService.listarClientes();
        const cliente = clientes.find(c => c.id === parseInt(userId));

        if (!cliente) {
          setErro("Cliente não encontrado.");
          return;
        }

        const enderecosCliente = cliente.enderecosEntrega || [];

        if (enderecosCliente.length === 0) {
          setErro("Nenhum endereço cadastrado.");
          return;
        }

        const enderecosFormatados = enderecosCliente.map((endereco, index) => ({
          ...endereco,
          id: endereco.id ?? index,
          apelido: `Endereço ${index + 1}`,
          principal: endereco.isPadrao ?? false,
          cidade: endereco.cidade || endereco.localidade || "",
          uf: endereco.uf || endereco.estado || ""
        }));

        setEnderecos(enderecosFormatados);

        const principal = enderecosFormatados.find(e => e.principal) || enderecosFormatados[0];
        setEnderecoSelecionado(principal.id);
      } catch (e) {
        setErro("Erro ao carregar os endereços.");
      } finally {
        setCarregando(false);
      }
    };

    carregarEnderecosCliente();
  }, [userId]);

  const handleSelecionarEndereco = (id) => {
    setEnderecoSelecionado(id);
    setErro(""); // Limpa erro se usuário seleciona algo
  };

  const handleConfirmarEndereco = () => {
    const endereco = enderecos.find(e => e.id === enderecoSelecionado);

    if (!endereco) {
      setErro("Selecione um endereço de entrega.");
      return;
    }

    const camposObrigatorios = ["logradouro", "numero", "bairro", "cidade", "uf", "cep"];
    const incompleto = camposObrigatorios.some(campo => !endereco[campo]);

    if (incompleto) {
      setErro("O endereço selecionado está incompleto.");
      return;
    }

    navigate("/checkout-carrinho", {
      state: {
        ...location.state,
        enderecoEntrega: endereco,
        userId: userId
      }
    });
  };

  const handleAdicionarEndereco = () => {
    navigate(`/alterar-dados-cliente/${userId}`, {
      state: {
        userId,
        adicionarEndereco: true
      }
    });
  };

  if (carregando) {
    return <div className="enderecoContainer">Carregando endereços...</div>;
  }

  return (
    <div className="enderecoContainer">
      <div className="enderecoFormContainer">
        <h1 className="enderecoTitulo">Selecione o endereço de entrega</h1>

        {erro && (
          <div className="semEnderecos">
            <p className="erro">{erro}</p>
          </div>
        )}

        {!erro && enderecos.length > 0 && (
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
