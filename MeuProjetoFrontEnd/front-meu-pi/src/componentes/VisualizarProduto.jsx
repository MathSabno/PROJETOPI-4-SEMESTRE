import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../estilos/visualizarProduto.css";

const VisualizarProduto = () => {
  const { id } = useParams(); // Obtém o ID da URL
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

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

  const obterImagemPadrao = () => {
    if (produto && produto.imagens && produto.imagens.length > 0) {
      const imagemPadrao = produto.imagens.find((img) => img.ehPadrao);
      return imagemPadrao ? imagemPadrao.caminhoImg : produto.imagens[0].caminhoImg;
    }
    return null;
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
            <p>{produto.descricao}</p>
            <p>Preço: R$ {produto.preco.toFixed(2)}</p>
            <p>Quantidade em Estoque: {produto.quantidade}</p>
            <p>Status: {produto.status === 1 ? "Ativo" : "Inativo"}</p>

            {obterImagemPadrao() && (
              <div className="imagemProduto">
                <img
                  src={`http://localhost:7075/${obterImagemPadrao()}`}
                  alt={produto.nome}
                  className="imagem"
                />
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