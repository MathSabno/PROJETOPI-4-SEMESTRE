import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Adicione useLocation
import authService from "../../services/authService";
import "../../estilos/listagemDeProdutosLogado.css";

const ListaProdutos = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Adicione esta linha para acessar o estado
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // Extrair dados do usuário do state de navegação
    const { userId, userNome: userNome } = location.state || {};

    useEffect(() => {
        console.log("Dados recebidos no Carrinho:", location.state);
    }, [location.state]);

    // Efeito para persistir dados no localStorage
    useEffect(() => {
        if (userId && userNome) {
            localStorage.setItem("userId", userId);
            localStorage.setItem("userNome", userNome);
        }
    }, [userId, userNome]); // Executa sempre que os dados mudarem


    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                const produtosAPI = await authService.listarProdutos();
                const produtosAtivos = produtosAPI.filter(produto => produto.status === 1);
                setProdutos(produtosAtivos);
                setCarregando(false);
            } catch (error) {
                setErro("Erro ao carregar produtos.");
                setCarregando(false);
                console.error("Erro ao buscar produtos:", error);
            }
        };

        buscarProdutos();
    }, []);


    const handleAlterarCliente = () => {
        // Passa o ID diretamente na rota
        navigate(`/alterar-dados-cliente/${userId}`, {
            state: {
                userId,
                userNome: userNome
            }
        });
    };

    const handleAlterarSenhaCliente = () => {
        // Passa o ID diretamente na rota
        navigate(`/alterar-senha-cliente/${userId}`, {
            state: {
                userId,
                userNome: userNome
            }
        });
    };

    const handleDetalheProduto = (id) => {
        navigate(`/detalhes-produto/${id}`, {
            state: {
                userId: userId,
                userNome: userNome
            }
        });
    };

    const handleLogout = () => {
        if (window.confirm("Deseja realmente sair da sua sessão?")) {
            authService.logout();
            navigate("/listagem-de-produtos");
        }
    };

    const handleAbrirCarrinho = () => {
        navigate("/carrinho", {
            state: {
                userId: userId,
                userNome: userNome // Mantenha o mesmo nome de chave usado no Carrinho
            }
        });
    };

    const handleDetalhesPedido = () => {
        // Passa o ID diretamente na rota
        navigate(`/pedido-cliente`, {
            state: {
                userId,
                userNome: userNome
            }
        });
    };

    return (
        <div className="container">
            <header className="header">
                <div className="logo-container"> {/* Nova div container */}
                    <div className="logo">
                        <img src="../logosite.png" alt="Logo da Loja" />
                    </div>
                    <div className="nome-empresa">
                        <h2>Os D de DEV</h2>
                    </div>
                </div>
                {/* ... outros elementos ... */}
                <div className="icones-direita">
                    <button className="botao-alterarDados" onClick={handleAlterarCliente}>
                        Alterar meus dados
                    </button>
                    <button className="botao-alterarSenha" onClick={handleAlterarSenhaCliente}>
                        Alterar senha
                    </button>
                    <button className="botao-alterarSenha" onClick={handleDetalhesPedido}>
                        Meus pedidos
                    </button>
                    <button className="botao-sair" onClick={handleLogout}>
                        Sair
                    </button>
                    <button
                        className="botao-carrinho"
                        onClick={handleAbrirCarrinho} // Usando a nova função
                    >
                        🛒
                    </button>

                </div>
            </header>

            {/* Listagem de produtos */}
            <div className="lista-produtos">
                <h1 className="titulo">Nossos Produtos</h1>

                {carregando ? (
                    <p>Carregando produtos...</p>
                ) : erro ? (
                    <p className="erro">{erro}</p>
                ) : (
                    <div className="grade-produtos">
                        {produtos.map((produto) => (
                            <div key={produto.id} className="card-produto">
                                <div className="imagem-produto">
                                    {produto.imagens && produto.imagens.length > 0 ? (
                                        <img
                                            src={`https://localhost:7075/api/Imagem/ExibirImagem/${produto.imagens[0].caminhoImg}`}
                                            alt={produto.nome}
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/150";
                                            }}
                                        />
                                    ) : (
                                        <img src="https://via.placeholder.com/150" alt="Sem imagem" />
                                    )}
                                </div>
                                <div className="info-produto">
                                    <h3>{produto.nome}</h3>
                                    <div className="avaliacao">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className={i < Math.floor(produto.avaliacaoProduto) ? "estrela-ativa" : "estrela-inativa"}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <p className="preco">R$ {produto.preco.toFixed(2)}</p>
                                    <button
                                        className="botao-detalhe"
                                        onClick={() => handleDetalheProduto(produto.id)}
                                    >
                                        Ver detalhes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListaProdutos;