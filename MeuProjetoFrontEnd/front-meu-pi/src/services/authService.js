import api from "../services/api";

const login = async (email, senha) => {
  try {
    const response = await api.post("/Login/Login", { email, senha });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao realizar o login. Tente novamente.";
  }
};

const loginCliente = async (email, senha) => {
  try {
    const response = await api.post("/Login/LoginCliente", { email, senha });
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

const atualizarProduto = async (formData) => {
  try {
    const response = await api.put("/Produto/UpdateProduto", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Define o tipo de conteúdo como FormData
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao atualizar produto.";
  }
};

const cadastrarProduto = async (formData) => {
  try {
    const response = await api.post("/Produto/CreateProduto", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Define o tipo de conteúdo como FormData
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao cadastrar produto.";
  }
};

const cadastrarCliente = async (cliente) => {
  try {
    const response = await api.post("/Cliente/CreateCliente", cliente); // 👈 Rota correta
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao cadastrar cliente.";
  }
};

// No arquivo authService.js
const listarClientes = async () => {
  try {
    const response = await api.get("/Cliente/ListarUsuários");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao listar clientes";
  }
};

const atualizarCliente = async (dados) => {
  try {
    const response = await api.put("/Cliente/UpdateCliente", dados);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao atualizar cliente";
  }
};

const alterarSenhaCliente = async (id, novaSenha) => {
  try {
    const response = await api.put(`/Cliente/AlterarSenha/${id}`, { NovaSenha: novaSenha });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao alterar a senha.";
  }
};

const cadastrarPedido = async (pedidoData) => {
  try {
    const response = await api.post("/Pedido/Pedido", pedidoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao cadastrar pedido.";
  }
};

const listarPedidos = async () => {
  try {
    const response = await api.get("/Pedido/ListarPedidos");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao listar pedidos";
  }
};

const atualizarStatusPedido = async (pedidoId, novoStatus) => {
  try {
    const response = await api.put(`/Pedido/AlterarStatus/${pedidoId}`, {
      status: novoStatus // Enviar o novo status no corpo como um objeto
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao atualizar status do pedido.";
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
};

export default { login, listarUsuarios, cadastrarUsuario, atualizarUsuario, alterarSenha, listarProdutos, atualizarProduto, cadastrarProduto, cadastrarCliente, atualizarCliente, listarClientes, loginCliente, logout, alterarSenhaCliente, cadastrarPedido, listarPedidos, atualizarStatusPedido};