import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import styles from "../../estilos/pedidoCliente.module.css"; // Importa o CSS Module

const PedidoCliente = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const itensPorPagina = 10;

    const { userId, userNome } = location.state || {};

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

    const handleDetalhesPedido = (pedido) => {
        setPedidoSelecionado(pedido);
    };

    const handleFecharModal = () => {
        setPedidoSelecionado(null);
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
        <div className={styles.container}>
            <div className={styles.listaPedidos}>
                <h1 className={styles.titulo}>Meus Pedidos</h1>

                {carregando ? (
                    <p className={styles.carregando}>Carregando pedidos...</p>
                ) : erro ? (
                    <p className={styles.erro}>{erro}</p>
                ) : (
                    <>
                        <div className={styles.tabelaPedidos}>
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
                                                <span className={`${styles.statusPago}`}>
                                                    {pedido.statusPedido}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={styles.botaoDetalhes}
                                                    onClick={() => handleDetalhesPedido(pedido)}
                                                >
                                                    Mais Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.controlesPaginacao}>
                            <button
                                onClick={paginaAnterior}
                                disabled={paginaAtual === 1}
                                className={styles.botaoPaginacao}
                            >
                                Anterior
                            </button>

                            <span className={styles.infoPagina}>
                                Página {paginaAtual} de {totalPaginas}
                            </span>

                            <button
                                onClick={proximaPagina}
                                disabled={paginaAtual === totalPaginas}
                                className={styles.botaoPaginacao}
                            >
                                Próxima
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Modal para mostrar os detalhes do pedido */}
            {pedidoSelecionado && (
                <div className={styles.modal}>
                    <div className={styles.modalConteudo}>
                        <h2>Detalhes do Pedido</h2>
                        <p><strong>ID do Pedido:</strong> #{pedidoSelecionado.id}</p>
                        <p><strong>Data:</strong> {formatarData(pedidoSelecionado.dataPedido)}</p>
                        <p><strong>Valor Total:</strong> R$ {pedidoSelecionado.valorTotal.toFixed(2)}</p>
                        <p><strong>Status:</strong> {pedidoSelecionado.statusPedido}</p>
                        <button onClick={handleFecharModal}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PedidoCliente;
