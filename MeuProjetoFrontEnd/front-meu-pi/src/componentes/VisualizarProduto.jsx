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
  const [imagemUrl, setImagemUrl] = useState(""); // Estado para armazenar a URL da imagem

  const buscarProdutoPorId = async () => {
    try {
      const produtos = await authService.listarProdutos();
      const produtoEncontrado = produtos.find((p) => p.id === parseInt(id));

      if (produtoEncontrado) {
        setProduto(produtoEncontrado);

        // Busca a imagem padrão do produto
        const imagemPadrao = obterImagemPadrao(produtoEncontrado);
        if (imagemPadrao) {
          // Monta a URL completa da imagem usando a rota de GET
          const urlImagem = `https://localhost:7075/api/Imagem/ExibirImagem/${imagemPadrao}`;
          setImagemUrl(urlImagem); // Atualiza o estado com a URL da imagem
        }
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

  const obterImagemPadrao = (produto) => {
    if (produto && produto.imagens && produto.imagens.length > 0) {
      const imagemPadrao = produto.imagens.find((img) => img.ehPadrao);
      const caminhoImg = imagemPadrao
        ? imagemPadrao.caminhoImg
        : produto.imagens[0].caminhoImg;
      console.log("Caminho da imagem recebido do back-end:", caminhoImg); // Log para depuração
      return caminhoImg; // Retorna apenas o nome do arquivo
    }
    return null;
  };
  useEffect(() => {
    buscarProdutoPorId();
  }, [id]);

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

            {imagemUrl && (
              <div className="imagemProduto">
                <img
                  src={imagemUrl}
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