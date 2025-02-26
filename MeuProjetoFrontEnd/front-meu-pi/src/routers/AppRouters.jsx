import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Login"; 
import HomeSite from "../HomeSite";
import CadastroUsuario from "../CadastroUsuario";
import ConsultaUsuarios from "../ConsultaUsuarios";
import AlterarUsuario from "../AlterarUsuario";
import AlterarSenha from "../AlterarSenha"; 

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