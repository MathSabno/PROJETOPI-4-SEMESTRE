import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import CurrencyInput from 'react-currency-input-field';
import "../../estilos/alterarProduto.css";

const AlterarProduto = () => {
  const { id } = useParams(); // Obtém o ID do produto da URL
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acessar o estado passado na navegação

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [avaliacao, setAvaliacao] = useState(1);
  const [preco, setPreco] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Estados para as imagens
  const [imagens, setImagens] = useState([]);
  const [imagensExistentes, setImagensExistentes] = useState([]);
  const [imagemPadraoIndex, setImagemPadraoIndex] = useState(null);
  const [imagensParaRemover, setImagensParaRemover] = useState([]); // Estado para imagens marcadas para remoção

  const userGroup = location.state?.userGroup; // Acessa o grupo do usuário

  console.log("Estado passado:", location.state); // Depuração
  console.log("Grupo do usuário:", userGroup); // Depuração

  // Carrega os dados do produto ao montar o componente
  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const produtos = await authService.listarProdutos(); // Busca todos os produtos
        const produto = produtos.find((p) => p.id === parseInt(id)); // Filtra o produto pelo ID

        if (produto) {
          setNome(produto.nome);
          setDescricao(produto.descricao);
          setPreco(produto.preco.toString());
          setQuantidadeEstoque(produto.quantidade.toString());
          setAvaliacao(produto.avaliacaoProduto);
          setImagensExistentes(produto.imagens);
        } else {
          setErro("Produto não encontrado.");
        }
      } catch (error) {
        setErro("Erro ao carregar o produto.");
      }
    };

    carregarProduto();
  }, [id]);

  // Função para validar os campos do formulário
  const validarCampos = () => {
    if (!nome || !descricao || !avaliacao || !preco || !quantidadeEstoque) {
      setErro("Todos os campos são obrigatórios.");
      return false;
    }

    if (nome.length > 200) {
      setErro("O nome do produto deve ter no máximo 200 caracteres.");
      return false;
    }

    if (descricao.length > 2000) {
      setErro("A descrição detalhada deve ter no máximo 2000 caracteres.");
      return false;
    }

    if (avaliacao < 1 || avaliacao > 5) {
      setErro("A avaliação deve ser um valor entre 1 e 5.");
      return false;
    }

    const precoNumerico = parseFloat(
      preco
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
    );
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      setErro("O preço deve ser um valor monetário válido.");
      return false;
    }

    if (isNaN(quantidadeEstoque) || parseInt(quantidadeEstoque) < 0) {
      setErro("A quantidade em estoque deve ser um número inteiro válido.");
      return false;
    }

    return true;
  };

  // Função para lidar com a seleção de novas imagens
  const handleImagensChange = (e) => {
    const files = Array.from(e.target.files);
    setImagens(files);
  };

  // Função para definir a imagem padrão
  const handleImagemPadraoChange = (index) => {
    setImagemPadraoIndex(index);
  };

  // Função para marcar/desmarcar imagens para remoção
  const handleRemoverImagem = (imagemId) => {
    setImagensParaRemover((prev) =>
      prev.includes(imagemId)
        ? prev.filter((id) => id !== imagemId) // Desmarca a imagem
        : [...prev, imagemId] // Marca a imagem para remoção
    );
  };

  // Função para atualizar o produto
  const handleAtualizar = async (e) => {
    e.preventDefault();

    // Valida os campos
    if (!validarCampos()) return;

    // Cria um objeto FormData
    const formData = new FormData();

    // Adiciona os campos ao FormData
    formData.append("id", id); // ID do produto
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("avaliacao", avaliacao);
    formData.append("preco", preco.replace("R$", "").replace(/\./g, "").replace(",", "."));
    formData.append("quantidadeEstoque", quantidadeEstoque);
    formData.append("status", 1); // Mantém o status como ativo

    // Adiciona as novas imagens ao FormData
    imagens.forEach((imagem, index) => {
      formData.append("imagens", imagem);
      if (index === imagemPadraoIndex) {
        formData.append("imagemPadraoIndex", index);
      }
    });

    // Adiciona as imagens para remoção ao FormData
    imagensParaRemover.forEach((imagemId) => {
      formData.append("imagensParaRemover", imagemId);
    });

    setCarregando(true);

    try {
      await authService.atualizarProduto(formData); // Usando o serviço
      setMensagem("Produto atualizado com sucesso!");
      setErro("");
      setTimeout(() => navigate("/consultar-produto", { state: { userGroup } }), 2000);
    } catch (error) {
      setErro(error.response?.data || "Erro ao atualizar produto.");
    } finally {
      setCarregando(false);
    }
  };

  // Verifica se o grupo de usuário é 2
  const isGrupo2 = userGroup === 2;

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="titulo">Alterar Produto</h1>
        <form onSubmit={handleAtualizar} className="form" encType="multipart/form-data">

          {/* Nome */}
          <div className="wrapInput">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
              required
              disabled={isGrupo2}
            />
            <span className="focusInput" data-placeholder="Nome"></span>
          </div>

          {/* Descrição */}
          <div className="wrapInput">
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição"
              required
              disabled={isGrupo2}
            />
            <span className="focusInput" data-placeholder="Descrição"></span>
          </div>

          {/* Avaliação */}
          <div className="wrapInput">
            <input
              type="number"
              value={avaliacao}
              onChange={(e) => setAvaliacao(parseFloat(e.target.value))}
              placeholder="Avaliação (1 a 5)"
              min={1}
              max={5}
              step={0.5}
              required
              disabled={isGrupo2}
            />
            <span className="focusInput" data-placeholder="Avaliação"></span>
          </div>

          {/* Preço */}
          <div className="wrapInput">
            <CurrencyInput
              placeholder="Preço"
              value={preco}
              onValueChange={(value) => setPreco(value)}
              decimalsLimit={2}
              decimalSeparator=","
              groupSeparator="."
              prefix="R$ "
              required
              disabled={isGrupo2}
            />
            <span className="focusInput" data-placeholder="Preço"></span>
          </div>

          {/* Quantidade em estoque */}
          <div className="wrapInput">
            <input
              type="number"
              value={quantidadeEstoque}
              onChange={(e) => setQuantidadeEstoque(e.target.value)}
              placeholder="Quantidade em Estoque"
              min={0}
              required
            />
            <span className="focusInput" data-placeholder="Quantidade em Estoque"></span>
          </div>

          {/* Upload de imagens */}
          <div className="wrapInput">
            <input
              type="file"
              onChange={handleImagensChange}
              multiple
              disabled={isGrupo2}
            />
            <span className="focusInput" data-placeholder="Imagens"></span>
          </div>

          {/* Pré-visualização de imagens */}
          {(imagensExistentes.length > 0 || imagens.length > 0) && (
            <div className="wrapInput">
              {imagensExistentes.map((imagem, index) => (
                <div key={index} className="imagemPreview">
                  <img
                    src={`https://localhost:7075/${imagem.caminhoImg}`}
                    alt={`Imagem ${index}`}
                  />
                  <div>
                    <input
                      type="checkbox"
                      checked={imagensParaRemover.includes(imagem.id)}
                      onChange={() => handleRemoverImagem(imagem.id)}
                      disabled={isGrupo2}
                    />
                    <label>Remover</label>
                    <input
                      type="radio"
                      name="imagemPadrao"
                      value={index}
                      onChange={() => handleImagemPadraoChange(index)}
                      disabled={isGrupo2}
                    />
                    <label>Padrão</label>
                  </div>
                </div>
              ))}
              {imagens.map((imagem, index) => (
                <div key={index + imagensExistentes.length} className="imagemPreview">
                  <img
                    src={URL.createObjectURL(imagem)}
                    alt={imagem.name}
                  />
                  <input
                    type="radio"
                    name="imagemPadrao"
                    value={index + imagensExistentes.length}
                    onChange={() => handleImagemPadraoChange(index + imagensExistentes.length)}
                    disabled={isGrupo2}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Botões */}
          <div className="containerLoginFormBtn">
            <button type="submit" className="loginFormBtn">
              {carregando ? "Carregando..." : "Atualizar"}
            </button>
          </div>

          <div className="containerLoginFormBtn">
            <button
              type="button"
              className="loginFormBtn"
              onClick={() => navigate("/consultar-produto", { state: { userGroup } })}
            >
              Voltar
            </button>
          </div>

          {/* Mensagens */}
          {erro && <p className="erro">{erro}</p>}
          {mensagem && <p className="mensagem">{mensagem}</p>}
        </form>
      </div>
    </div>
  );
};

export default AlterarProduto;