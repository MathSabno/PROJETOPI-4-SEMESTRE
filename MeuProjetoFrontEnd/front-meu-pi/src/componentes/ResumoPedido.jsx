import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import "../estilos/resumopedido.css";

const ResumoPedido = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extrai os dados do estado (igual ao CheckoutCarrinho)
    const { 
      itens = [], 
      frete = { nome: "", valor: 0 }, 
      enderecoEntrega, 
      metodoPagamento,
      dadosCartao = {} 
    } = location.state || {};
  
    // Funções de cálculo
    const calcularSubtotal = () => {
      return itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    };
  
    const calcularTotal = () => {
      return calcularSubtotal() + frete.valor;
    };
  
    // Formata a forma de pagamento para exibição
    const formatarPagamento = () => {
      if (metodoPagamento === 'boleto') {
        return 'Boleto Bancário';
      }
      
      if (metodoPagamento === 'cartao' && dadosCartao.numero) {
        const last4 = dadosCartao.numero.replace(/\s/g, '').slice(-4);
        return `Cartão de Crédito (**** **** **** ${last4})`;
      }
      
      return 'Forma de pagamento não selecionada';
    };
  
    // Verifica se há itens no carrinho
    if (!itens || itens.length === 0) {
      return (
        <div className="resumoContainer">
          <div className="resumoFormContainer">
            <h1 className="resumoTitulo">Resumo do Pedido</h1>
            <p>Seu carrinho está vazio.</p>
            <button onClick={() => navigate('/')} className="resumoBtnSecundario">
              Voltar para a loja
            </button>
          </div>
        </div>
      );
    }
  
    // Verifica se há endereço de entrega
    if (!enderecoEntrega) {
      return (
        <div className="resumoContainer">
          <div className="resumoFormContainer">
            <h1 className="resumoTitulo">Resumo do Pedido</h1>
            <p>Endereço de entrega não selecionado.</p>
            <button onClick={() => navigate('/checkout')} className="resumoBtnSecundario">
              Selecionar endereço
            </button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="resumoContainer">
        <div className="resumoFormContainer">
          <h1 className="resumoTitulo">Resumo do Pedido</h1>
          
          {/* Seção de Produtos - com todas as informações obrigatórias */}
          <div className="resumoSection">
            <h2 className="resumoSubtitulo">Produtos</h2>
            <div className="tabelaProdutos">
              <div className="tabelaCabecalho">
                <span>Produto</span>
                <span>Valor Unitário</span>
                <span>Quantidade</span>
                <span>Valor Total</span>
              </div>
              {itens.map((item) => (
                <div key={item.id} className="tabelaLinha">
                  <span>{item.nome}</span>
                  <span>R$ {item.preco.toFixed(2)}</span>
                  <span>{item.quantidade}</span>
                  <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
  
          {/* Seção de Valores */}
          <div className="resumoValores">
            <h2 className="resumoSubtitulo">Resumo Financeiro</h2>
            <div className="resumoValorItem">
              <span>Subtotal:</span>
              <span>R$ {calcularSubtotal().toFixed(2)}</span>
            </div>
            <div className="resumoValorItem">
              <span>Frete ({frete.nome}):</span>
              <span>R$ {frete.valor.toFixed(2)}</span>
            </div>
            <div className="resumoValorItem destaque">
              <span>Total Geral:</span>
              <span>R$ {calcularTotal().toFixed(2)}</span>
            </div>
          </div>
  
          {/* Seção de Endereço de Entrega */}
          <div className="resumoEndereco">
            <h2 className="resumoSubtitulo">Endereço de Entrega</h2>
            <div className="resumoEnderecoInfo">
              <p>{enderecoEntrega.logradouro}, {enderecoEntrega.numero}</p>
              {enderecoEntrega.complemento && <p>{enderecoEntrega.complemento}</p>}
              <p>{enderecoEntrega.bairro}</p>
              <p>{enderecoEntrega.cidade} - {enderecoEntrega.uf}</p>
              <p>CEP: {enderecoEntrega.cep}</p>
            </div>
          </div>
  
          {/* Seção de Forma de Pagamento */}
          <div className="resumoPagamento">
            <h2 className="resumoSubtitulo">Forma de Pagamento</h2>
            <div className="resumoPagamentoInfo">
              <p>{formatarPagamento()}</p>
              {metodoPagamento === 'cartao' && dadosCartao.parcelas && (
                <p>Parcelado em {dadosCartao.parcelas}x de R$ {(calcularTotal() / dadosCartao.parcelas).toFixed(2)}</p>
              )}
            </div>
          </div>
  
          {/* Botões de Ação */}
          <div className="resumoBotoes">
            <button 
              onClick={() => navigate('/confirmacao-pedido', { state: location.state })}
              className="resumoBtnPrimario"
            >
              Concluir Compra
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="resumoBtnSecundario"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ResumoPedido;