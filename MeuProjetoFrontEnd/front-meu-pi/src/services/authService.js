import api from "../services/api";

const login = async (email, senha) => {
  try {
    const response = await api.post("/Login/Login", { email, senha });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao realizar o login. Tente novamente.";
  }
};

const listarUsuarios = async () => {
  try {
    const response = await api.get("/Usuario/ListarUsuários");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao buscar usuários.";
  }
};

const cadastrarUsuario = async (usuario) => {
  try {
    const response = await api.post("/Usuario/CreateUsuário", usuario);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao cadastrar usuário.";
  }
};

const atualizarUsuario = async (usuario) => {
  try {
    const response = await api.put("/Usuario/UpdateUsuário", usuario);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao atualizar usuário.";
  }
};

const alterarSenha = async (id, novaSenha) => {
  try {
    const response = await api.put(`/Usuario/AlterarSenha/${id}`, { NovaSenha: novaSenha });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao alterar a senha.";
  }
};

const listarProdutos = async () => {
  try {
    const response = await api.get("/Produto/ListarProdutos");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao buscar produtos.";
  }
};

const atualizarProduto = async (produto) => {
  try {
    const response = await api.put("/Produto/UpdateProduto", produto);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao atualizar produto.";
  }
};

const cadastrarProduto = async (produto) => {
  try {
    const response = await api.post("/Produto/CreateProduto", produto);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao cadastrar produto.";
  }
};

export default { login, listarUsuarios, cadastrarUsuario, atualizarUsuario, alterarSenha, listarProdutos, atualizarProduto, cadastrarProduto };