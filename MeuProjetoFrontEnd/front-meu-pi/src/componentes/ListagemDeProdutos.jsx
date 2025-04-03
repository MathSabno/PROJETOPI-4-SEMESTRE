import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../estilos/listagemDeProdutos.css";

const ListaProdutos = () => {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                const produtosAPI = await authService.listarProdutos();
                // Filtrar apenas produtos ativos (status 1)
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

    const handleDetalheProduto = (id) => {
        navigate(`/detalhes-produto/${id}`);
    };

    return (
        <div className="container">
            {/* Cabeçalho com logo e ícones */}
            <header className="header">
                <div className="logo-container"> {/* Nova div container */}
                    <div className="logo">
                        <img src="../logosite.png" alt="Logo da Loja" /> 
                    </div>
                    <div className="nome-empresa">
                        <h2>Os D de DEV</h2>
                    </div>
                </div>
                <div className="icones-direita">
                    <button className="botao-login" onClick={() => navigate("/login")}>
                        Faça login/Crie seu login
                    </button>
                    <button className="botao-carrinho" onClick={() => navigate("/carrinho")}>
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