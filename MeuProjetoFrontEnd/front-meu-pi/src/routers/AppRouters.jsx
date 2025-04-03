import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../componentes/Login";
import HomeSite from "../componentes/HomeSite";
import CadastroUsuario from "../componentes/CadastroUsuario";
import ConsultaUsuarios from "../componentes/ConsultaUsuarios";
import AlterarUsuario from "../componentes/AlterarUsuario";
import AlterarSenha from "../componentes/AlterarSenha";
import ConsultarProduto from "../componentes/ConsultarProduto";
import CadastroProduto from "../componentes/CadastroProduto";
import VisualizarProduto from "../componentes/VisualizarProduto";
import AlterarProduto from "../componentes/AlterarProduto";
import ListagemDeProdutos from "../componentes/ListagemDeProdutos";
import DetalhesProduto from "../componentes/DetalhesProduto";
import Carrinho from "../componentes/Carrinho";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListagemDeProdutos />} />
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
        <Route path="/detalhes-produto/:id" element={<DetalhesProduto />} />
        <Route path="/carrinho/" element={<Carrinho />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;