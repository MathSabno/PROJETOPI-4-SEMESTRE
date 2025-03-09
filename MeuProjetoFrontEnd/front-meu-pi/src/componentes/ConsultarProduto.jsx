import React, { useEffect, useState } from "react";
import authService from "../services/authService"; // Importando o serviço
import { useNavigate } from "react-router-dom"; // Importando useNavigate para redirecionamento
import "../estilos/consultaProduto.css"; // Importando o arquivo CSS

const ConsultarProduto = () => {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]); // Estado para armazenar os produtos
  const [carregando, setCarregando] = useState(true); // Estado para controlar o carregamento
  const [termoBusca, setTermoBusca] = useState(""); // Estado para o campo de busca
  const [paginaAtual, setPaginaAtual] = useState(1); // Estado para a paginação
  const [produtosSelecionados, setProdutosSelecionados] = useState([]); // Estado para armazenar os produtos selecionados
  const produtosPorPagina = 10; // Número de produtos por página

  // Função para listar os produtos
  const buscarProdutos = async () => {
    try {
      const produtos = await authService.listarProdutos(); // Usando o serviço
      // Ordena os produtos por ID em ordem decrescente (últimos inseridos primeiro)
      const produtosOrdenados = produtos.sort((a, b) => b.id - a.id);
      setProdutos(produtosOrdenados); // Atualiza o estado com os produtos
      setCarregando(false); // Finaliza o carregamento
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setCarregando(false); // Finaliza o carregamento mesmo em caso de erro
    }
  };

  const handleCadastrarProduto = () => {
    navigate("/cadastro-produto");
  };

  const filtrarProdutos = (produtos) => {
    return produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );
  };

  const toggleSelecaoProduto = (id) => {
    if (produtosSelecionados.includes(id)) {
      setProdutosSelecionados(produtosSelecionados.filter((produtoId) => produtoId !== id));
    } else {
      setProdutosSelecionados([...produtosSelecionados, id]);
    }
  };

  const desativarProdutos = async () => {
    if (produtosSelecionados.length === 0) {
      alert("Selecione pelo menos um produto para alterar o status.");
      return;
    }

    try {
      await Promise.all(
        produtosSelecionados.map(async (id) => {
          const produto = produtos.find((p) => p.id === id);
          if (produto) {
            produto.status = produto.status === 1 ? 2 : 1;
            await authService.atualizarProduto(produto); 
          }
        })
      );

      alert("Status dos produtos atualizado com sucesso!");
      buscarProdutos(); 
      setProdutosSelecionados([]); 
    } catch (error) {
      console.error("Erro ao atualizar o status dos produtos:", error);
      alert("Erro ao atualizar o status dos produtos.");
    }
  };

  const handleEditarProduto = (id) => {
    navigate(`/alterar-produto/${id}`);
  }; 

  const handleVisualizarProduto = (id) => {
    navigate(`/visualizar-produto/${id}`);
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const produtosFiltrados = filtrarProdutos(produtos);

  const indexUltimoProduto = paginaAtual * produtosPorPagina;
  const indexPrimeiroProduto = indexUltimoProduto - produtosPorPagina;
  const produtosPaginaAtual = produtosFiltrados.slice(
    indexPrimeiroProduto,
    indexUltimoProduto
  );

  // Calcula o número total de páginas
  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);

  return (
    <div className="consultaProduto">
      <div className="consultaProdutoFormContainer">
        <h1 className="titulo">Consulta de Produtos</h1>
        <div className="campoBusca">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
        {carregando ? (
          <div className="carregando">
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            <table className="tabela">
              <thead>
                <tr>
                  <th className="cabecalho"></th>
                  <th className="cabecalho">Código</th>
                  <th className="cabecalho">Nome</th>
                  <th className="cabecalho">Quantidade</th>
                  <th className="cabecalho">Valor</th>
                  <th className="cabecalho">Status</th>
                  <th className="cabecalho">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosPaginaAtual.map((produto) => (
                  <tr
                    key={produto.id}
                    className="linha"
                    style={{
                      textDecoration: produto.status === "Inativo" ? "line-through" : "none",
                    }}
                  >
                    <td className="celula">
                      <input
                        type="checkbox"
                        checked={produtosSelecionados.includes(produto.id)}
                        onChange={() => toggleSelecaoProduto(produto.id)}
                      />
                    </td>
                    <td className="celula">{produto.id}</td>
                    <td className="celula">{produto.nome}</td>
                    <td className="celula">{produto.quantidade}</td>
                    <td className="celula">R$ {produto.preco.toFixed(2)}</td>
                    <td className="celula">{produto.status === 1 ? "Ativo" : "Inativo"}</td>
                    <td className="celula">
                      <button onClick={() => handleEditarProduto(produto.id)} className="acaoBtn">
                        Alterar
                      </button>
                      <button onClick={() => desativarProdutos([produto.id])} className="acaoBtn">
                      {produto.status === 1 ? "Desativar" : "Ativar"}
                      </button>
                      <button onClick={() => handleVisualizarProduto(produto.id)} className="acaoBtn">
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="paginacao">
              {Array.from({ length: totalPaginas }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPaginaAtual(index + 1)}
                  className={paginaAtual === index + 1 ? "ativo" : ""}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="botoesContainer">
              <button onClick={handleCadastrarProduto} className="loginFormBtn">
                + INCLUIR PRODUTO
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConsultarProduto;