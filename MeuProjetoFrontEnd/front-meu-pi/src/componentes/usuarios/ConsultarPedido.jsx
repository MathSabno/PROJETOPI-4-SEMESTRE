import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import styles from "../../estilos/alterarStatusPedido.module.css"; // Importando o CSS Module

const ConsultarPedido = () => {
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

    // Função para alterar o status do pedido
    const handleAlterarStatus = async (pedidoId) => {
        const status = prompt("Digite o novo status do pedido (ex: 'Em andamento', 'Concluído', 'Cancelado'):");

        if (status) {
            try {
                // Enviar a atualização para o back-end
                const response = await authService.atualizarStatusPedido(pedidoId, status);
                alert("Status do pedido alterado com sucesso!");
                // Atualizar a lista de pedidos no front-end após a alteração
                setPedidos((prevPedidos) =>
                    prevPedidos.map((pedido) =>
                        pedido.id === pedidoId ? { ...pedido, statusPedido: status } : pedido
                    )
                );
            } catch (error) {
                alert("Erro ao alterar o status do pedido.");
                console.error("Erro ao alterar status:", error);
            }
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
                                                    onClick={() => handleAlterarStatus(pedido.id)} // Alterando o status
                                                >
                                                    Alterar status
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Controles de Paginação */}
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
        </div>
    );
};

export default ConsultarPedido;
