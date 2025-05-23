import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importando useLocation para acessar o estado
import "../estilos/homeSite.css"; // Importando o arquivo CSS

const HomeSite = () => {
  const navigate = useNavigate(); // Hook para navegação
  const location = useLocation(); // Hook para acessar o estado passado na navegação

  const userGroup = location.state?.userGroup; // Acessa o grupo do usuário

  console.log("Estado passado:", location.state); // Depuração
  console.log("Grupo do usuário:", userGroup); // Depuração

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="titulo">Bem-vindo ao Sistema de Usuários</h1>
        <div className="botoesContainer">
          <button className="loginFormBtn" onClick={() => navigate("/consultar-produto", { state: { userGroup } })}>
            Consultar Produto
          </button>
          {/* Mostra o botão "Consultar Usuário" apenas para Administradores */}
          {userGroup === 1 && (
            <button onClick={() => navigate("/consulta-usuario")} className="loginFormBtn">
              Consultar Usuário
            </button>
          )}
          {userGroup === 2 && (
            <button onClick={() => navigate("/consultar-pedido")} className="loginFormBtn">
              Consultar Pedidos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSite;