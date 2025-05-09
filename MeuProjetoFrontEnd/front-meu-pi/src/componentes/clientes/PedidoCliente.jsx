import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import "../../estilos/pedidoCliente.css";

const PedidoCliente = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    // Extrair dados do usuário
    const { userId, userNome } = location.state || {};

    // Calcular índices de paginação
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const pedidosAtuais = pedidos.slice(indicePrimeiroItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(pedidos.length / itensPorPagina);

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

    const handleLogout = () => {
        if (window.confirm("Deseja realmente sair da sua sessão?")) {
            authService.logout();
            navigate("/listagem-de-produtos");
        }
    };

    const handleVoltar = () => {
        navigate("/listagem-de-produtos-logado", {
            state: {
                userId: userId,
                userNome: userNome
            },
        });
    };

    // Funções de navegação entre páginas
    const proximaPagina = () => {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const paginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
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
                    <button className="botao-sair" onClick={handleLogout}>
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
                    <>
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
                                    {pedidosAtuais.map((pedido) => (
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

                        {/* Controles de Paginação */}
                        <div className="controles-paginacao">
                            <button 
                                onClick={paginaAnterior}
                                disabled={paginaAtual === 1}
                                className="botao-paginacao"
                            >
                                Anterior
                            </button>
                            
                            <span className="info-pagina">
                                Página {paginaAtual} de {totalPaginas}
                            </span>
                            
                            <button 
                                onClick={proximaPagina}
                                disabled={paginaAtual === totalPaginas}
                                className="botao-paginacao"
                            >
                                Próxima
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PedidoCliente;