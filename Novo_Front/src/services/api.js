// Configuração base da API
const API_BASE_URL = 'http://localhost:8080';

// Função para fazer requisições HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Para DELETE requests que não retornam conteúdo
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// API de Pizzas
export const pizzaAPI = {
  // Listar todas as pizzas
  getAll: () => apiRequest('/pizzas'),

  // Buscar pizza por ID
  getById: (id) => apiRequest(`/pizzas/${id}`),

  // Criar nova pizza
  create: (pizza) =>
    apiRequest('/pizzas', {
      method: 'POST',
      body: JSON.stringify(pizza),
    }),

  // Atualizar pizza
  update: (id, pizza) =>
    apiRequest(`/pizzas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pizza),
    }),

  // Deletar pizza
  delete: (id) =>
    apiRequest(`/pizzas/${id}`, {
      method: 'DELETE',
    }),
};

// API de Carrinho
export const carrinhoAPI = {
  // Listar itens do carrinho
  getItens: (carrinhoId) => apiRequest(`/carrinho/${carrinhoId}`),

  // Adicionar item ao carrinho
  adicionarItem: (item, clienteId) =>
    apiRequest(`/carrinho?clienteId=${clienteId}`, {
      method: 'POST',
      body: JSON.stringify({
        pizzaId: item.pizzaId, // Corrige para enviar pizzaId corretamente
        quantidade: item.quantidade,
        preco: item.preco,
      }),
    }),

  // Remover item do carrinho
  removerItem: (itemId) =>
    apiRequest(`/carrinho/${itemId}`, {
      method: 'DELETE',
    }),

  // Atualizar quantidade do item
  atualizarQuantidade: (item) =>
    apiRequest('/carrinho', {
      method: 'PUT',
      body: JSON.stringify(item),
    }),

  // Listar todos os carrinhos
  getAll: () => apiRequest('/carrinho'),
};

// API de Clientes
export const clienteAPI = {
  // Listar todos os clientes
  getAll: () => apiRequest('/clientes'),

  // Criar novo cliente
  create: (cliente) =>
    apiRequest('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    }),

  // Login de cliente
  login: (data) =>
    apiRequest('/clientes/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }),
};

// API de Pedidos
export const pedidoAPI = {
  // Finalizar pedido
  finalizar: (clienteId, carrinhoId) =>
    apiRequest(`/pedidos?clienteId=${clienteId}&carrinhoId=${carrinhoId}`, {
      method: 'POST',
    }),

  // Listar pedidos por cliente
  getByCliente: (clienteId) => apiRequest(`/pedidos?clienteId=${clienteId}`),

  // Listar todos os pedidos
  getAll: () => apiRequest('/pedidos/all'),
};

// API de Usuários (se existir)
export const userAPI = {
  // Listar todos os usuários
  getAll: () => apiRequest('/users'),

  // Buscar usuário por ID
  getById: (id) => apiRequest(`/user/${id}`),

  // Criar novo usuário
  create: (user) =>
    apiRequest('/user', {
      method: 'POST',
      body: JSON.stringify(user),
    }),

  // Atualizar usuário
  update: (id, user) =>
    apiRequest(`/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    }),

  // Deletar usuário
  delete: (id) =>
    apiRequest(`/user/${id}`, {
      method: 'DELETE',
    }),
};

// Função para verificar se o backend está rodando
export const checkBackendStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pizzas`);
    return response.ok;
  } catch (error) {
    console.error('Backend não está rodando:', error);
    return false;
  }
};

const api = {
  pizzaAPI,
  carrinhoAPI,
  clienteAPI,
  pedidoAPI,
  userAPI,
  checkBackendStatus,
};

export default api;
