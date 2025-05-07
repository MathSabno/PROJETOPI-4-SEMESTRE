import React, { useState } from "react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "../../estilos/cadastroProduto.css";
import CurrencyInput from 'react-currency-input-field'; // Importe a biblioteca de formatação de moeda

const CadastroProduto = () => {
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [avaliacao, setAvaliacao] = useState(1);
  const [preco, setPreco] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Estado para armazenar as imagens selecionadas
  const [imagens, setImagens] = useState([]);
  const [imagemPadraoIndex, setImagemPadraoIndex] = useState(null); // Índice da imagem padrão

  // Função para arredondar a avaliação
  const arredondarAvaliacao = (valor) => {
    return Math.floor(valor);
  };

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

    // Converte o preço para número e valida
    const precoNumerico = parseFloat(
      preco
        .replace("R$", "") // Remove o prefixo "R$"
        .replace(/\./g, "") // Remove os pontos (separadores de milhares)
        .replace(",", ".") // Substitui a vírgula por ponto
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

  // Função para lidar com a seleção de imagens
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

  // Função para definir a imagem padrão
  const handleImagemPadraoChange = (index) => {
    setImagemPadraoIndex(index);
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    // Valida os campos
    if (!validarCampos()) return;

    // Arredonda a avaliação para o menor valor inteiro
    const avaliacaoArredondada = arredondarAvaliacao(avaliacao);

    // Converte o preço para número
    const precoNumerico = parseFloat(
      preco
        .replace("R$", "") // Remove o prefixo "R$"
        .replace(/\./g, "") // Remove os pontos (separadores de milhares)
        .replace(",", ".") // Substitui a vírgula por ponto
    );

    // Cria um objeto FormData para enviar os dados do produto e as imagens
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("avaliacao", avaliacaoArredondada);
    formData.append("preco", precoNumerico); // Usa o valor convertido
    formData.append("quantidadeEstoque", parseInt(quantidadeEstoque));
    formData.append("status", 1);

    // Adiciona as imagens ao FormData
    imagens.forEach((imagem, index) => {
      formData.append("imagens", imagem); // Adiciona cada imagem
      if (index === imagemPadraoIndex) {
        formData.append("imagemPadraoIndex", index); // Define a imagem padrão
      }
    });

    console.log("Dados enviados:", formData); // Log para depuração

    setCarregando(true); // Inicia o carregamento

    try {
      await authService.cadastrarProduto(formData); // Usando o serviço
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
    <div className="container">
      <div className="formContainer">
        <h1 className="titulo">Cadastro de Produto</h1>
        <form onSubmit={handleCadastro} className="form" encType="multipart/form-data">
          {/* Campo: Nome */}
          <div className="wrapInput">
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input"
              placeholder="Nome"
              maxLength={200}
              required
            />
            <span className="focusInput" data-placeholder="Nome"></span>
          </div>

          {/* Campo: Descrição */}
          <div className="wrapInput">
            <input
              type="text"
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="input"
              placeholder="Descrição"
              required
            />
            <span className="focusInput" data-placeholder="Descrição"></span>
          </div>

          {/* Campo: Avaliação */}
          <div className="wrapInput">
            <input
              type="number"
              id="avaliacao"
              value={avaliacao}
              onChange={(e) => setAvaliacao(parseFloat(e.target.value))}
              className="input"
              placeholder="Avaliação (1 a 5)"
              min={1}
              max={5}
              step={0.5}
              required
            />
            <span className="focusInput" data-placeholder="Avaliação"></span>
          </div>

          {/* Campo: Preço */}
          <div className="wrapInput">
            <CurrencyInput
              id="preco"
              name="preco"
              placeholder="Preço"
              value={preco}
              onValueChange={(value) => setPreco(value)}
              decimalsLimit={2} // Limita a 2 casas decimais
              decimalSeparator="," // Usa vírgula como separador decimal
              groupSeparator="." // Usa ponto como separador de milhares
              prefix="R$ " // Adiciona o prefixo de moeda
              className="input"
              required
            />
            <span className="focusInput" data-placeholder="Preço"></span>
          </div>

          {/* Campo: Quantidade em Estoque */}
          <div className="wrapInput">
            <input
              type="number"
              id="quantidadeEstoque"
              value={quantidadeEstoque}
              onChange={(e) => setQuantidadeEstoque(e.target.value)}
              className="input"
              placeholder="Quantidade em Estoque"
              min={0}
              required
            />
            <span className="focusInput" data-placeholder="Quantidade em Estoque"></span>
          </div>

          {/* Campo: Upload de Imagens */}
          <div className="wrapInput">
            <input
              type="file"
              id="imagens"
              onChange={handleImagensChange}
              className="input"
              multiple // Permite selecionar várias imagens
              required
            />
            <span className="focusInput" data-placeholder="Imagens"></span>
          </div>

          {/* Prévia das Imagens Carregadas */}
          {imagens.length > 0 && (
            <div className="wrapInput">
              <label>Imagens Carregadas:</label>
              {imagens.map((imagem, index) => (
                <div key={index}>
                  <img
                    src={URL.createObjectURL(imagem)}
                    alt={imagem.name}
                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
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

          {/* Botão de Cadastro */}
          <div className="containerLoginFormBtn">
            <button type="submit" className="loginFormBtn" disabled={carregando}>
              {carregando ? "Carregando..." : "Cadastrar"}
            </button>
          </div>
        </form>

        {/* Botão de Voltar */}
        <div className="containerLoginFormBtn">
          <button onClick={() => navigate("/consultar-produto")} className="loginFormBtn">
            Voltar
          </button>
        </div>

        {/* Mensagens de erro e sucesso */}
        {erro && <p className="erro">{erro}</p>}
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
};

export default CadastroProduto;