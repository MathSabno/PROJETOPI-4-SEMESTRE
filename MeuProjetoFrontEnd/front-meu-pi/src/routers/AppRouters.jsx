import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../componentes/usuarios/Login";
import LoginCliente from "../componentes/clientes/LoginCliente";
import HomeSite from "../componentes/HomeSite";
import CadastroUsuario from "../componentes/usuarios/CadastroUsuario";
import ConsultaUsuarios from "../componentes/usuarios/ConsultaUsuarios";
import AlterarUsuario from "../componentes/usuarios/AlterarUsuario";
import AlterarSenha from "../componentes/usuarios/AlterarSenha";
import ConsultarProduto from "../componentes/produtos/ConsultarProduto";
import CadastroProduto from "../componentes/produtos/CadastroProduto";
import VisualizarProduto from "../componentes/produtos/VisualizarProduto";
import AlterarProduto from "../componentes/produtos/AlterarProduto";
import ListagemDeProdutos from "../componentes/produtos/ListagemDeProdutos";
import ListagemDeProdutosLogado from "../componentes/produtos/ListagemDeProdutosLogado";
import DetalhesProduto from "../componentes/produtos/DetalhesProduto";
import Carrinho from "../componentes/checkout/Carrinho";
import AlterarDadosCliente from "../componentes/clientes/AlterarDadosCliente";
import CadastroCliente from "../componentes/clientes/CadastroCliente";
import AlterarSenhaCliente from "../componentes/clientes/AlterarSenhaCliente";
import Checkout from "../componentes/checkout/Checkout";
import CheckoutCarrinho from "../componentes/checkout/CheckoutCarrinho";
import ResumoPedido from "../componentes/checkout/ResumoPedido";
import PedidoCliente from "../componentes/clientes/PedidoCliente";
import ConsultarPedido from "../componentes/usuarios/ConsultarPedido";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home-site" element={<HomeSite />} />
        <Route path="/alterar-usuario/:id" element={<AlterarUsuario />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/consulta-usuario" element={<ConsultaUsuarios />} />
        <Route path="/alterar-senha/:id" element={<AlterarSenha />} />
        <Route path="/consultar-produto/" element={<ConsultarProduto />} />
        <Route path="/cadastro-produto/" element={<CadastroProduto />} />
        <Route path="/visualizar-produto/:id" element={<VisualizarProduto />} />
        <Route path="/alterar-produto/:id" element={<AlterarProduto />} />
        <Route path="/listagem-de-produtos" element={<ListagemDeProdutos />} />
        <Route path="/listagem-de-produtos-logado" element={<ListagemDeProdutosLogado />} />
        <Route path="/detalhes-produto/:id" element={<DetalhesProduto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/alterar-dados-cliente/:id" element={<AlterarDadosCliente />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        <Route path="/alterar-senha-cliente/:id" element={<AlterarSenhaCliente />} />
        <Route path="/login-cliente" element={<LoginCliente />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout-carrinho" element={<CheckoutCarrinho />} />
        <Route path="/resumo-pedido" element={<ResumoPedido />} />
        <Route path="/pedido-cliente" element={<PedidoCliente />} />
        <Route path="/consultar-pedido" element={<ConsultarPedido />} /> 
      </Routes>
    </Router>
  );
};

export default AppRoutes;