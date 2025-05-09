import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import authService from "../../services/authService";
import "../../estilos/detalhesProduto.css";

const DetalheProduto = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [imagemSelecionada, setImagemSelecionada] = useState(0);
    const [quantidade, setQuantidade] = useState(1);

    // Extrair dados do usuário do state de navegação
    const { userId, userNome: userNome } = location.state || {};

    useEffect(() => {
        console.log("Dados recebidos no Carrinho:", location.state);
    }, [location.state]);

    useEffect(() => {
        const buscarProduto = async () => {
            try {
                const produtos = await authService.listarProdutos();
                const produtoEncontrado = produtos.find(p => p.id === parseInt(id));

                if (produtoEncontrado) {
                    setProduto({
                        ...produtoEncontrado,
                        // Garante que temos um array de imagens mesmo que vazio
                        imagens: produtoEncontrado.imagens || []
                    });
                } else {
                    setErro("Produto não encontrado.");
                }
            } catch (error) {
                setErro("Erro ao carregar detalhes do produto.");
                console.error("Erro ao buscar produto:", error);
            } finally {
                setCarregando(false);
            }
        };

        buscarProduto();
    }, [id]);

    const adicionarAoCarrinho = () => {
        navigate("/carrinho", {
            state: {
                produto,
                quantidade,
                userId,
                userNome: userNome
            }
        });
    };

    const handleComprarAgora = () => {
        navigate("/carrinho", {
            state: {
                produto,
                quantidade,
                compraRapida: true,
                userId,
                userNome: userNome
            }
        });
    };

    if (carregando) {
        return (
            <div className="container">
                <div className="formContainer">
                    <p>Carregando detalhes do produto...</p>
                </div>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="container">
                <div className="formContainer">
                    <p className="erro">{erro}</p>
                    <button onClick={() => navigate(-1)} className="loginFormBtn">
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    if (!produto) {
        return (
            <div className="container">
                <div className="formContainer">
                    <p className="erro">Produto não disponível</p>
                    <button onClick={() => navigate(-1)} className="loginFormBtn">
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="formContainer">
                <button
                    onClick={() => navigate(-1)}
                    className="loginFormBtn voltarBtn"
                >
                    Voltar
                </button>

                <div className="detalheProduto">
                    {/* Galeria de imagens */}
                    <div className="galeria">
                        <div className="imagemPrincipal">
                            {produto.imagens.length > 0 ? (
                                <img
                                    src={`https://localhost:7075/api/Imagem/ExibirImagem/${produto.imagens[imagemSelecionada].caminhoImg}`}
                                    alt={produto.nome}
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/600x400";
                                    }}
                                />
                            ) : (
                                <img
                                    src="https://via.placeholder.com/600x400"
                                    alt="Produto sem imagem"
                                />
                            )}
                        </div>
                        <div className="miniaturas">
                            {produto.imagens.length > 0 ? (
                                produto.imagens.map((img, index) => (
                                    <img
                                        key={index}
                                        src={`https://localhost:7075/api/Imagem/ExibirImagem/${img.caminhoImg}`}
                                        alt={`Miniatura ${index + 1}`}
                                        className={index === imagemSelecionada ? "ativo" : ""}
                                        onClick={() => setImagemSelecionada(index)}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/100";
                                        }}
                                    />
                                ))
                            ) : (
                                <p>Nenhuma imagem disponível</p>
                            )}
                        </div>
                    </div>

                    {/* Informações do produto */}
                    <div className="infoProduto">
                        <h1 className="titulo">{produto.nome}</h1>

                        <div className="avaliacao">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={i < Math.floor(produto.avaliacaoProduto) ? "cheia" : "vazia"}
                                >
                                    ★
                                </span>
                            ))}
                            <span>({produto.avaliacaoProduto?.toFixed(1) || '0.0'})</span>
                        </div>

                        <p className="preco">R$ {produto.preco.toFixed(2)}</p>

                        <div className="estoque">
                            {produto.quantidade > 0 ? (
                                <span className="disponivel">Em estoque ({produto.quantidade} unidades)</span>
                            ) : (
                                <span className="indisponivel">Indisponível</span>
                            )}
                        </div>

                        <div className="descricao">
                            <h3>Descrição do Produto</h3>
                            <p>{produto.descricao || "Nenhuma descrição disponível."}</p>
                        </div>

                        {produto.quantidade > 0 && (
                            <>
                                <div className="quantidade">
                                    <label>Quantidade:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={produto.quantidade}
                                        value={quantidade}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 1;
                                            setQuantidade(Math.max(1, Math.min(produto.quantidade, value)));
                                        }}
                                    />
                                </div>

                                <div className="botoesAcao">
                                    <button
                                        onClick={handleComprarAgora}
                                        className="loginFormBtn comprarBtn"
                                    >
                                        Comprar agora
                                    </button>
                                    <button
                                        onClick={adicionarAoCarrinho}
                                        className="loginFormBtn carrinhoBtn"
                                    >
                                        Adicionar ao Carrinho
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalheProduto;