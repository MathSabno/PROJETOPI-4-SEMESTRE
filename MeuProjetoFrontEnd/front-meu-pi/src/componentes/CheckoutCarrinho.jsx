import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../estilos/checkoutCarrinho.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { itens = [], frete = { nome: "", valor: 0 } } = location.state || {};

  const calcularSubtotal = () => {
    return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() + frete.valor;
  };

  const finalizarPedido = () => {
    // Aqui você poderia fazer um POST para o backend com os dados do pedido
    alert("Pedido finalizado com sucesso!");
    navigate("/carrinho"); // Redireciona para o carrinho
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="titulo">Finalizar Pedido</h1>

        {itens.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <>
            <div className="resumoProdutos">
              <h3>Itens no Pedido</h3>
              {itens.map((item) => (
                <div key={item.id} className="itemCheckout">
                  <span>{item.nome} (x{item.quantidade})</span>
                  <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                </div>
              ))}
              <div className="linhaResumo">
                <span>Subtotal:</span>
                <span>R$ {calcularSubtotal().toFixed(2)}</span>
              </div>
              <div className="linhaResumo">
                <span>Frete ({frete.nome}):</span>
                <span>R$ {frete.valor.toFixed(2)}</span>
              </div>
              <div className="linhaResumo total">
                <strong>Total:</strong>
                <strong>R$ {calcularTotal().toFixed(2)}</strong>
              </div>
            </div>

            <div className="dadosPagamento">
              <h3>Dados para Pagamento</h3>
              <input type="text" placeholder="Nome no Cartão" />
              <input type="text" placeholder="Número do Cartão" />
              <input type="text" placeholder="Validade (MM/AA)" />
              <input type="text" placeholder="CVV" />
            </div>

            <button onClick={finalizarPedido} className="botaoFinalizarCompra">
              Confirmar Pedido
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
