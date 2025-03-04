import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../componentes/Login"; 
import HomeSite from "../componentes/HomeSite";
import CadastroUsuario from "../componentes/CadastroUsuario";
import ConsultaUsuarios from "../componentes/ConsultaUsuarios";
import AlterarUsuario from "../componentes/AlterarUsuario";
import AlterarSenha from "../componentes/AlterarSenha"; 

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
      </Routes>
    </Router>
  );
};

export default AppRoutes;