import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../estilos/visualizarProduto.css";

const VisualizarProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [imagemAtual, setImagemAtual] = useState(0);

  const buscarProdutoPorId = async () => {
    try {
      const produtos = await authService.listarProdutos();
      const produtoEncontrado = produtos.find((p) => p.id === parseInt(id));

      if (produtoEncontrado) {
        setProduto(produtoEncontrado);
      } else {
        setErro("Produto não encontrado.");
      }
    } catch (error) {
      setErro("Erro ao buscar o produto.");
      console.error("Erro ao buscar produto:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarProdutoPorId();
  }, [id]);

  const proximaImagem = () => {
    setImagemAtual((prev) => (prev + 1) % produto.imagens.length);
  };

  const imagemAnterior = () => {
    setImagemAtual((prev) => (prev - 1 + produto.imagens.length) % produto.imagens.length);
  };

  if (carregando) {
    return <div className="carregando">Carregando...</div>;
  }

  if (erro) {
    return <div className="erro">{erro}</div>;
  }

  return (
    <div className="visualizarProduto">
      <div className="visualizarProdutoContainer">
        <h1 className="titulo">Visualizar Produto</h1>
        {produto && (
          <div className="detalhesProduto">
            <h2>{produto.nome}</h2>
            <p>Código do Produto: {produto.descricao}</p>
            <p>Preço: R$ {produto.preco.toFixed(2)}</p>
            <p>Quantidade em Estoque: {produto.quantidade}</p>
            <p>Avaliação: {produto.avaliacaoProduto}</p>

            {produto.imagens && produto.imagens.length > 0 && (
              <div className="slider">
                <button onClick={imagemAnterior} className="btn-anterior">
                  &#9664;
                </button>

                <div className="imagem-container">
                  <img
                    src={`https://localhost:7075/api/Imagem/ExibirImagem/${produto.imagens[imagemAtual].caminhoImg}`}
                    alt={produto.nome}
                    className="imagem"
                    onError={(e) => {
                      e.target.src = "caminho/para/imagem-padrao.jpg"; // Fallback para imagem padrão
                    }}
                  />
                  <div className="contador-imagens">
                    {imagemAtual + 1} / {produto.imagens.length}
                  </div>
                </div>

                <button onClick={proximaImagem} className="btn-proximo">
                  &#9654;
                </button>
              </div>
            )}

            <button onClick={() => navigate("/consultar-produto")} className="botaoVoltar">
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizarProduto;