import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import styles from "../../estilos/alterarStatusPedido.module.css";

const ConsultarPedido = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    const { userId, userNome } = location.state || {};

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const pedidosAtuais = pedidos.slice(indicePrimeiroItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(pedidos.length / itensPorPagina);

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [novoStatus, setNovoStatus] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);

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

    const handleLogout = () => {
        if (window.confirm("Deseja realmente sair da sua sessão?")) {
            authService.logout();
            navigate("/login");
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

    const handleAlterarStatus = (pedidoId) => {
        setPedidoSelecionado(pedidoId);
        setMostrarModal(true);
    };

    const confirmarAlteracaoStatus = async () => {
        if (!novoStatus) return;

        try {
            await authService.atualizarStatusPedido(pedidoSelecionado, novoStatus);
            alert("Status do pedido alterado com sucesso!");

            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.id === pedidoSelecionado ? { ...pedido, statusPedido: novoStatus } : pedido
                )
            );

            setMostrarModal(false);
            setPedidoSelecionado(null);
            setNovoStatus("");
        } catch (error) {
            alert("Erro ao alterar o status do pedido.");
            console.error("Erro ao alterar status:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.listaPedidos}>
                <h1 className={styles.titulo}>Meus Pedidos</h1>

                {carregando ? (
                    <p>Carregando pedidos...</p>
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
                                                <span className={`status-${pedido.statusPedido.toLowerCase()}`}>
                                                    {pedido.statusPedido}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={styles.botaoAlterarStatus}
                                                    onClick={() => handleAlterarStatus(pedido.id)}
                                                >
                                                    Alterar status
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

            {/* Modal para alterar status */}
            {mostrarModal && (
                <div className={styles.modal}>
                    <div className={styles.modalConteudo}>
                        <h2>Alterar Status do Pedido</h2>
                        <select
                            value={novoStatus}
                            onChange={(e) => setNovoStatus(e.target.value)}
                            className={styles.selectStatus}
                        >
                            <option value="">Selecione um status</option>
                            <option value="Aguardando pagamento">Aguardando pagamento</option>
                            <option value="Pagamento rejeitado">Pagamento rejeitado</option>
                            <option value="Pagamento com sucesso">Pagamento com sucesso</option>
                            <option value="Aguardando retirada">Aguardando retirada</option>
                            <option value="Em trânsito">Em trânsito</option>
                            <option value="Entregue">Entregue</option>
                        </select>
                        <div className={styles.modalBotoes}>
                            <button onClick={confirmarAlteracaoStatus} className={styles.botaoConfirmar}>
                                Confirmar
                            </button>
                            <button onClick={() => setMostrarModal(false)} className={styles.botaoCancelar}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultarPedido;
