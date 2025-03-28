import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../estilos/carrinho.css";

// Função para gerenciar o carrinho no localStorage
const gerenciarCarrinho = {
  get: () => {
    try {
      const carrinho = localStorage.getItem("carrinho");
      return carrinho ? JSON.parse(carrinho) : [];
    } catch (error) {
      console.error("Erro ao ler carrinho:", error);
      return [];
    }
  },
  set: (itens) => {
    localStorage.setItem("carrinho", JSON.stringify(itens));
  },
  adicionarItem: (produto, quantidade = 1) => {
    const itens = gerenciarCarrinho.get();
    const itemExistente = itens.find(item => item.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      itens.push({
        ...produto,
        quantidade,
        // Garante que temos um array de imagens
        imagens: produto.imagens || []
      });
    }

    gerenciarCarrinho.set(itens);
    return itens;
  },
  removerItem: (id) => {
    const itens = gerenciarCarrinho.get().filter(item => item.id !== id);
    gerenciarCarrinho.set(itens);
    return itens;
  },
  atualizarQuantidade: (id, quantidade) => {
    const itens = gerenciarCarrinho.get().map(item => 
      item.id === id ? { ...item, quantidade } : item
    );
    gerenciarCarrinho.set(itens);
    return itens;
  }
};

const Carrinho = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Atualiza o contador do carrinho no cabeçalho
  const atualizarContadorCarrinho = () => {
    const totalItens = gerenciarCarrinho.get().reduce((acc, item) => acc + item.quantidade, 0);
    document.dispatchEvent(new CustomEvent('carrinhoAtualizado', { detail: totalItens }));
  };

  // Carrega os itens do carrinho e verifica se há produto para adicionar
  useEffect(() => {
    const carregarCarrinho = () => {
      try {
        // Verifica se há produto para adicionar (vindo da tela de detalhes)
        if (location.state?.produto) {
          const { produto, quantidade = 1 } = location.state;
          const novosItens = gerenciarCarrinho.adicionarItem(produto, quantidade);
          setItens(novosItens);
          atualizarContadorCarrinho();
          // Remove o state para não adicionar novamente
          navigate(location.pathname, { replace: true });
        } else {
          setItens(gerenciarCarrinho.get());
        }
        
        setCarregando(false);
      } catch (error) {
        setErro("Erro ao carregar carrinho");
        setCarregando(false);
      }
    };

    carregarCarrinho();
  }, [location, navigate]);

  const removerItem = (id) => {
    const novosItens = gerenciarCarrinho.removerItem(id);
    setItens(novosItens);
    atualizarContadorCarrinho();
  };

  const atualizarQuantidade = (id, novaQuantidade) => {
    if (novaQuantidade < 1) {
      removerItem(id);
      return;
    }

    const novosItens = gerenciarCarrinho.atualizarQuantidade(id, novaQuantidade);
    setItens(novosItens);
    atualizarContadorCarrinho();
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const finalizarCompra = () => {
    navigate("/checkout", { state: { itens } });
  };

  if (carregando) {
    return (
      <div className="container">
        <div className="formContainer">
          <p>Carregando carrinho...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container">
        <div className="formContainer">
          <p className="erro">{erro}</p>
          <button onClick={() => navigate("/")} className="loginFormBtn">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="titulo">Meu Carrinho</h1>

        {itens.length === 0 ? (
          <div className="carrinhoVazio">
            <p className="mensagem">Seu carrinho está vazio</p>
            <button
              onClick={() => navigate("/listagem-de-produtos")}
              className="loginFormBtn"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="listaItens">
              {itens.map((item) => (
                <div key={item.id} className="itemCarrinho">
                  <div className="imagemItem">
                    {item.imagens.length > 0 ? (
                      <img
                        src={`https://localhost:7075/api/Imagem/ExibirImagem/${item.imagens[0].caminhoImg}`}
                        alt={item.nome}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/150"
                        alt="Produto sem imagem"
                      />
                    )}
                  </div>
                  <div className="infoItem">
                    <h3 onClick={() => navigate(`/detalhe-produto/${item.id}`)} style={{ cursor: 'pointer' }}>
                      {item.nome}
                    </h3>
                    <p className="precoItem">R$ {item.preco.toFixed(2)}</p>
                    <div className="controleQuantidade">
                      <button
                        onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                        className="botaoQuantidade"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantidade}
                        min="1"
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          atualizarQuantidade(item.id, value);
                        }}
                      />
                      <button
                        onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                        className="botaoQuantidade"
                      >
                        +
                      </button>
                    </div>
                    <p className="subtotalItem">
                      Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removerItem(item.id)}
                    className="botaoRemover"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="resumoCarrinho">
              <h3>Resumo do Pedido</h3>
              <div className="linhaResumo">
                <span>Subtotal ({itens.reduce((acc, item) => acc + item.quantidade, 0)} itens)</span>
                <span>R$ {calcularTotal().toFixed(2)}</span>
              </div>
              <button
                onClick={finalizarCompra}
                className="botaoFinalizarCompra"
              >
                Finalizar Compra
              </button>
              <button
                onClick={() => navigate("/listagem-de-produtos")}
                className="botaoContinuarComprando"
              >
                Continuar Comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Carrinho;