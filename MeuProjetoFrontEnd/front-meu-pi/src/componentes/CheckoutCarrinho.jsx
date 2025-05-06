import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../estilos/checkoutCarrinho.css";

const CheckoutCarrinho = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { itens = [], frete = { nome: "", valor: 0 }, enderecoEntrega } = location.state || {};
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [dadosCartao, setDadosCartao] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
    parcelas: "1"
  });
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  const calcularSubtotal = () => {
    return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() + frete.valor;
  };

  const validarCartao = () => {
    const novosErros = {};
    
    if (!dadosCartao.numero || dadosCartao.numero.replace(/\s/g, '').length !== 16) {
      novosErros.numero = "Número do cartão inválido";
    }
    
    if (!dadosCartao.nome || dadosCartao.nome.trim().split(" ").length < 2) {
      novosErros.nome = "Nome completo no cartão";
    }
    
    if (!dadosCartao.validade || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(dadosCartao.validade)) {
      novosErros.validade = "Validade inválida (MM/AA)";
    }
    
    if (!dadosCartao.cvv || dadosCartao.cvv.length !== 3) {
      novosErros.cvv = "CVV inválido";
    }
    
    return novosErros;
  };

  const validarFormulario = () => {
    const errosValidacao = {};
    
    if (!metodoPagamento) {
      errosValidacao.metodoPagamento = "Selecione uma forma de pagamento";
    }
    
    if (metodoPagamento === "cartao") {
      Object.assign(errosValidacao, validarCartao());
    }
    
    return errosValidacao;
  };

  const handleChangeCartao = (e) => {
    const { name, value } = e.target;
    
    // Formatação do número do cartão
    if (name === "numero") {
      const formatted = value.replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      setDadosCartao(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // Formatação da validade
    if (name === "validade") {
      const formatted = value.replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
      setDadosCartao(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // Limitação do CVV
    if (name === "cvv") {
      setDadosCartao(prev => ({ ...prev, [name]: value.replace(/\D/g, '').substring(0, 3) }));
      return;
    }
    
    setDadosCartao(prev => ({ ...prev, [name]: value }));
  };

  const finalizarPedido = async () => {
    const errosValidacao = validarFormulario();
    
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao);
      return;
    }
    
    setCarregando(true);
    
    try {
      // Aqui você faria a chamada para a API para processar o pagamento
      // const response = await api.post("/pedidos", { ... });
      
      // Simulando uma requisição assíncrona
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redireciona para a tela de confirmação
      navigate("/confirmacao-pedido", {
        state: {
          pedido: {
            itens,
            frete,
            enderecoEntrega,
            metodoPagamento,
            total: calcularTotal(),
            numeroPedido: Math.floor(Math.random() * 1000000) // Número fictício
          }
        }
      });
    } catch (error) {
      setErros({ geral: "Erro ao processar pedido. Tente novamente." });
    } finally {
      setCarregando(false);
    }
  };

  if (!itens || itens.length === 0) {
    return (
      <div className="container">
        <div className="formContainer">
          <h1 className="titulo">Finalizar Pedido</h1>
          <p>Seu carrinho está vazio.</p>
          <button onClick={() => navigate("/")} className="botaoVoltar">
            Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  if (!enderecoEntrega) {
    return (
      <div className="container">
        <div className="formContainer">
          <h1 className="titulo">Finalizar Pedido</h1>
          <p>Endereço de entrega não selecionado.</p>
          <button onClick={() => navigate("/checkout")} className="botaoVoltar">
            Selecionar endereço
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="titulo">Finalizar Pedido</h1>

        <div className="resumoSection">
          <h3>Resumo do Pedido</h3>
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

        <div className="enderecoSection">
          <h3>Endereço de Entrega</h3>
          <p>{enderecoEntrega.logradouro}, {enderecoEntrega.numero}</p>
          <p>{enderecoEntrega.bairro}, {enderecoEntrega.cidade} - {enderecoEntrega.uf}</p>
          <p>CEP: {enderecoEntrega.cep}</p>
        </div>

        <div className="pagamentoSection">
          <h3>Forma de Pagamento</h3>
          
          {erros.geral && <p className="erro">{erros.geral}</p>}
          
          <div className="metodosPagamento">
            <label className="metodoPagamento">
              <input
                type="radio"
                name="metodoPagamento"
                value="boleto"
                checked={metodoPagamento === "boleto"}
                onChange={() => setMetodoPagamento("boleto")}
              />
              <span>Boleto Bancário</span>
            </label>
            
            <label className="metodoPagamento">
              <input
                type="radio"
                name="metodoPagamento"
                value="cartao"
                checked={metodoPagamento === "cartao"}
                onChange={() => setMetodoPagamento("cartao")}
              />
              <span>Cartão de Crédito</span>
            </label>
            
            {erros.metodoPagamento && <p className="erro">{erros.metodoPagamento}</p>}
          </div>

          {metodoPagamento === "cartao" && (
            <div className="dadosCartao">
              <div className="formGroup">
                <label>Número do Cartão</label>
                <input
                  type="text"
                  name="numero"
                  value={dadosCartao.numero}
                  onChange={handleChangeCartao}
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                />
                {erros.numero && <p className="erro">{erros.numero}</p>}
              </div>
              
              <div className="formGroup">
                <label>Nome no Cartão</label>
                <input
                  type="text"
                  name="nome"
                  value={dadosCartao.nome}
                  onChange={handleChangeCartao}
                  placeholder="Como escrito no cartão"
                />
                {erros.nome && <p className="erro">{erros.nome}</p>}
              </div>
              
              <div className="formGroupLinha">
                <div className="formGroup">
                  <label>Validade (MM/AA)</label>
                  <input
                    type="text"
                    name="validade"
                    value={dadosCartao.validade}
                    onChange={handleChangeCartao}
                    placeholder="MM/AA"
                    maxLength="5"
                  />
                  {erros.validade && <p className="erro">{erros.validade}</p>}
                </div>
                
                <div className="formGroup">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={dadosCartao.cvv}
                    onChange={handleChangeCartao}
                    placeholder="000"
                    maxLength="3"
                  />
                  {erros.cvv && <p className="erro">{erros.cvv}</p>}
                </div>
              </div>
              
              <div className="formGroup">
                <label>Parcelas</label>
                <select
                  name="parcelas"
                  value={dadosCartao.parcelas}
                  onChange={handleChangeCartao}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>
                      {num}x de R$ {(calcularTotal() / num).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={finalizarPedido} 
          className="botaoFinalizarCompra"
          disabled={carregando}
        >
          {carregando ? "Processando..." : "Confirmar Pedido"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutCarrinho;