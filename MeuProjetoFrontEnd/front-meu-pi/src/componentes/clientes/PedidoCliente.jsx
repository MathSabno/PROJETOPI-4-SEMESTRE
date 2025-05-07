import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import "../../estilos/listagemDeProdutosLogado.css";

const PedidoCliente = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // Extrair dados do usuário
    const { userId, userNome } = location.state || {};

    useEffect(() => {
        const buscarPedidos = async () => {
            try {
                const pedidosAPI = await authService.listarPedidos();
                setPedidos(pedidosAPI);
                setCarregando(false);
            } catch (error) {
                setErro("Erro ao carregar pedidos.");
                setCarregando(false);
                console.error("Erro ao buscar pedidos:", error);
            }
        };

        buscarPedidos();
    }, []);

    const formatarData = (dataString) => {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    };

    const handleDetalhesPedido = (pedidoId) => {
        navigate(`/detalhes-pedido/${pedidoId}`, {
            state: {
                userId,
                userNome
            }
        });
    };

    const handleVoltar = () => {
        navigate(-1);
    };

    return (
        <div className="container">
            <header className="header">
                {/* Cabeçalho igual ao da ListaProdutos */}
                <div className="logo-container">
                    <div className="logo">
                        <img src="../logosite.png" alt="Logo da Loja" />
                    </div>
                    <div className="nome-empresa">
                        <h2>Os D de DEV</h2>
                    </div>
                </div>

                <div className="icones-direita">
                    <button className="botao-voltar" onClick={handleVoltar}>
                        Voltar
                    </button>
                    <button className="botao-sair" onClick={() => authService.logout()}>
                        Sair
                    </button>
                </div>
            </header>

            <div className="lista-pedidos">
                <h1 className="titulo">Meus Pedidos</h1>

                {carregando ? (
                    <p>Carregando pedidos...</p>
                ) : erro ? (
                    <p className="erro">{erro}</p>
                ) : (
                    <div className="tabela-pedidos">
                        <table>
                            <thead>
                                <tr>
                                    <th>Número</th>
                                    <th>Data</th>
                                    <th>Valor Total</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.id}>
                                        <td>#{pedido.id}</td>
                                        <td>{formatarData(pedido.dataPedido)}</td>
                                        <td>R$ {pedido.valorTotal.toFixed(2)}</td>
                                        <td>
                                            <span className={`status-${pedido.statusPedido.toLowerCase()}`}>
                                                {pedido.statusPedido}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="botao-detalhes"
                                                onClick={() => handleDetalhesPedido(pedido.id)}
                                            >
                                                Mais Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PedidoCliente;