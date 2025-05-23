import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "../../estilos/loginCliente.css"; // Usamos o mesmo CSS
import CurrencyInput from 'react-currency-input-field';

const CadastroProduto = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [avaliacao, setAvaliacao] = useState(1);
  const [preco, setPreco] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [imagens, setImagens] = useState([]);
  const [imagemPadraoIndex, setImagemPadraoIndex] = useState(null);

  useEffect(() => {
    document.body.classList.add("login-page-body");
    return () => {
      document.body.classList.remove("login-page-body");
    };
  }, []);

  const arredondarAvaliacao = (valor) => Math.floor(valor);

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
      preco.replace("R$", "").replace(/\./g, "").replace(",", ".")
    );
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      setErro("O preço deve ser um valor monetário válido.");
      return false;
    }

    if (isNaN(quantidadeEstoque) || parseInt(quantidadeEstoque) < 0) {
      setErro("A quantidade em estoque deve ser um número inteiro válido.");
      return false;
    }

    if (imagens.length === 0) {
      setErro("Selecione pelo menos uma imagem.");
      return false;
    }

    return true;
  };

  const handleImagensChange = (e) => {
    const files = Array.from(e.target.files);
    const extensoesPermitidas = ['.jpg', '.jpeg', '.png', '.gif'];

    const arquivosValidos = files.filter(file => {
      const extensao = file.name.split('.').pop().toLowerCase();
      return extensoesPermitidas.includes(`.${extensao}`);
    });

    if (arquivosValidos.length !== files.length) {
      setErro("Apenas arquivos JPG, JPEG, PNG e GIF são permitidos.");
      return;
    }

    setImagens(arquivosValidos);
    setImagemPadraoIndex(null);
  };

  const handleImagemPadraoChange = (index) => {
    setImagemPadraoIndex(index);
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    const avaliacaoArredondada = arredondarAvaliacao(avaliacao);
    const precoNumerico = parseFloat(
      preco.replace("R$", "").replace(/\./g, "").replace(",", ".")
    );

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("avaliacao", avaliacaoArredondada);
    formData.append("preco", precoNumerico);
    formData.append("quantidadeEstoque", parseInt(quantidadeEstoque));
    formData.append("status", 1);

    imagens.forEach((imagem, index) => {
      formData.append("imagens", imagem);
      if (index === imagemPadraoIndex) {
        formData.append("imagemPadraoIndex", index);
      }
    });

    setCarregando(true);

    try {
      await authService.cadastrarProduto(formData);
      setMensagem("Produto cadastrado com sucesso!");
      setErro("");
      setTimeout(() => navigate("/consultar-produto"), 2000);
    } catch (error) {
      setErro(error.response?.data || "Erro ao cadastrar produto.");
      setMensagem("");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Cadastro de Produto</h2>
        <form onSubmit={handleCadastro} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <input
              type="text"
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="avaliacao">Avaliação (1 a 5)</label>
            <input
              type="number"
              id="avaliacao"
              value={avaliacao}
              onChange={(e) => setAvaliacao(parseFloat(e.target.value))}
              min={1}
              max={5}
              step={0.5}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preco">Preço</label>
            <CurrencyInput
              id="preco"
              name="preco"
              placeholder="Preço"
              value={preco}
              onValueChange={(value) => setPreco(value)}
              decimalsLimit={2}
              decimalSeparator=","
              groupSeparator="."
              prefix="R$ "
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantidadeEstoque">Quantidade em Estoque</label>
            <input
              type="number"
              id="quantidadeEstoque"
              value={quantidadeEstoque}
              onChange={(e) => setQuantidadeEstoque(e.target.value)}
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imagens">Imagens do Produto</label>
            <input
              type="file"
              id="imagens"
              onChange={handleImagensChange}
              multiple
              required
            />
          </div>

          {imagens.length > 0 && (
            <div className="form-group">
              <label>Pré-visualização:</label>
              {imagens.map((imagem, index) => (
                <div key={index}>
                  <img
                    src={URL.createObjectURL(imagem)}
                    alt={imagem.name}
                    style={{ width: "50px", height: "50px", marginRight: "10px" }}
                  />
                  <input
                    type="radio"
                    name="imagemPadrao"
                    value={index}
                    onChange={() => handleImagemPadraoChange(index)}
                  />
                  {imagem.name}
                </div>
              ))}
            </div>
          )}

          {erro && <p className="mensagem erro">{erro}</p>}
          {mensagem && <p className="mensagem">{mensagem}</p>}

          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? "Carregando..." : "Cadastrar Produto"}
          </button>

          <button
            type="button"
            className="login-button cadastro"
            onClick={() => navigate("/consultar-produto")}
          >
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroProduto;
