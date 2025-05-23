import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../estilos/carrinho.css";

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
    const itemExistenteIndex = itens.findIndex(item => item.id === produto.id);

    if (itemExistenteIndex !== -1) {
      // Atualiza os dados do produto, respeitando a nova quantidade solicitada
      const novaQuantidade = Math.min(quantidade, produto.quantidade || Infinity);
      itens[itemExistenteIndex] = {
        ...produto,
        quantidade: novaQuantidade,
        imagens: produto.imagens || []
      };
    } else {
      // Adiciona novo item com a quantidade correta
      itens.push({
        ...produto,
        quantidade: Math.min(quantidade, produto.quantidade || Infinity),
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

// Opções de frete
const opcoesFrete = [
  { id: 1, nome: "Envio rápido", valor: 20.00 },
  { id: 2, nome: "Envio normal", valor: 30.00 },
  { id: 3, nome: "Data agendada", valor: 25.00 }
];

const Carrinho = () => {
  // Declaração de todos os hooks primeiro
  const navigate = useNavigate();
  const location = useLocation();
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [freteSelecionado, setFreteSelecionado] = useState(opcoesFrete[0]);

  // Extrair dados do state APÓS os hooks
  const userId = location.state?.userId;
  const userNome = location.state?.userNome;

  useEffect(() => {
    console.log("Dados recebidos no Carrinho:", location.state);
  }, [location.state]);

  // Função para atualizar contador
  const atualizarContadorCarrinho = () => {
    const totalItens = gerenciarCarrinho.get().reduce((acc, item) => acc + item.quantidade, 0);
    document.dispatchEvent(new CustomEvent('carrinhoAtualizado', { detail: totalItens }));
  };

  // ÚNICO useEffect para carregar o carrinho
  useEffect(() => {
    const carregarCarrinho = () => {
      try {
        if (location.state?.produto) {
          const { produto, quantidade = 1 } = location.state;
          const novosItens = gerenciarCarrinho.adicionarItem(produto, quantidade);
          setItens(novosItens);
          atualizarContadorCarrinho();
          navigate(location.pathname, {
            replace: true,
            state: {
              ...location.state
            }
          });
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

  const calcularSubtotal = () => {
    return itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    return subtotal + freteSelecionado.valor;
  };

  const handleFreteChange = (event) => {
    const freteId = parseInt(event.target.value);
    const frete = opcoesFrete.find(f => f.id === freteId);
    setFreteSelecionado(frete || opcoesFrete[0]);
  };

  const finalizarCompra = () => {
    // Validação de cliente logado no clique de finalizar compra
    if (!userId || !userNome) {
      alert("Você precisa estar logado para finalizar a compra.");
      navigate("/login-cliente");  // Redireciona para página de login, por exemplo
      return;
    }

    navigate("/checkout", {
      state: {
        itens,
        frete: freteSelecionado,
        userId: userId,
        userNome: userNome
      }
    });
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
              onClick={() => navigate("/listagem-de-produtos-logado", {
                state: {
                  userId: userId,
                  userNome: userNome
                }
              })}
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
                <span>R$ {calcularSubtotal().toFixed(2)}</span>
              </div>

              <div className="selecaoFrete">
                <label htmlFor="frete">Opção de Frete:</label>
                <select
                  id="frete"
                  value={freteSelecionado.id}
                  onChange={handleFreteChange}
                  className="comboFrete"
                >
                  {opcoesFrete.map((frete) => (
                    <option key={frete.id} value={frete.id}>
                      {frete.nome} - R$ {frete.valor.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="linhaResumo">
                <span>Frete:</span>
                <span>R$ {freteSelecionado.valor.toFixed(2)}</span>
              </div>

              <div className="linhaResumo total">
                <span>Total:</span>
                <span>R$ {calcularTotal().toFixed(2)}</span>
              </div>

              <button
                onClick={finalizarCompra}
                className="botaoFinalizarCompra"
              >
                Finalizar Compra
              </button>
              <button
                onClick={() => navigate("/listagem-de-produtos-logado", {
                  state: {
                    userId: userId,
                    userNome: userNome
                  },
                })}
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
