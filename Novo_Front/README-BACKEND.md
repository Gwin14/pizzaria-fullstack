# Conexão com Backend - Pizzaria Deliciosa

## Visão Geral

Este documento descreve como o frontend se conecta com o backend Spring Boot para gerenciar pizzas, carrinhos, pedidos e clientes.

## Configuração da API

### URL Base
```javascript
const API_BASE_URL = 'http://localhost:8080';
```

### Endpoints Disponíveis

#### Pizzas (`/pizzas`)
- `GET /pizzas` - Listar todas as pizzas
- `GET /pizzas/{id}` - Buscar pizza por ID
- `POST /pizzas` - Criar nova pizza
- `PUT /pizzas/{id}` - Atualizar pizza
- `DELETE /pizzas/{id}` - Deletar pizza

#### Carrinho (`/carrinho`)
- `GET /carrinho/{carrinhoId}` - Listar itens do carrinho
- `POST /carrinho` - Adicionar item ao carrinho
- `DELETE /carrinho/{itemId}` - Remover item do carrinho
- `PUT /carrinho` - Atualizar quantidade do item
- `GET /carrinho` - Listar todos os carrinhos

#### Clientes (`/clientes`)
- `GET /clientes` - Listar todos os clientes
- `POST /clientes` - Criar novo cliente

#### Pedidos (`/pedidos`)
- `POST /pedidos?clienteId={id}&carrinhoId={id}` - Finalizar pedido
- `GET /pedidos?clienteId={id}` - Listar pedidos por cliente
- `GET /pedidos/all` - Listar todos os pedidos

## Estrutura do Serviço de API

### Arquivo: `src/services/api.js`

```javascript
// Função base para requisições HTTP
const apiRequest = async (endpoint, options = {}) => {
  // Configuração padrão para todas as requisições
  // Tratamento de erros centralizado
  // Headers padrão
};

// APIs organizadas por domínio
export const pizzaAPI = { /* métodos para pizzas */ };
export const carrinhoAPI = { /* métodos para carrinho */ };
export const clienteAPI = { /* métodos para clientes */ };
export const pedidoAPI = { /* métodos para pedidos */ };
```

## Como Usar

### 1. Importar a API
```javascript
import { pizzaAPI, carrinhoAPI } from '../services/api';
```

### 2. Fazer Requisições
```javascript
// Buscar todas as pizzas
const pizzas = await pizzaAPI.getAll();

// Criar nova pizza
const novaPizza = await pizzaAPI.create({
  nome: "Margherita",
  descricao: "Molho, mussarela, manjericão",
  preco: 25.90
});

// Adicionar ao carrinho
await carrinhoAPI.adicionarItem({
  pizzaId: 1,
  quantidade: 2,
  preco: 25.90,
  carrinho: { id: 1 }
});
```

## Tratamento de Erros

### Estrutura de Erro
```javascript
try {
  const data = await pizzaAPI.getAll();
  // Sucesso
} catch (error) {
  console.error('Erro na requisição:', error);
  // Tratar erro
}
```

### Mensagens de Erro Padrão
- "Erro ao carregar pizzas. Verifique se o backend está rodando."
- "Erro ao salvar pizza. Verifique se o backend está rodando."
- "Erro ao adicionar item. Verifique se o backend está rodando."

## Status do Backend

### Componente BackendStatus
- Monitora a conectividade com o backend
- Exibe indicador visual (online/offline)
- Verifica status a cada 30 segundos
- Posicionado no canto inferior direito

### Estados
- **Online**: Ponto verde pulsante + "Backend Online"
- **Offline**: Ponto vermelho + "Backend Offline"

## Páginas Conectadas

### 1. Home (`/`)
- Busca pizzas populares do backend
- Exibe loading state durante carregamento
- Mostra erro se backend estiver offline

### 2. Cardápio (`/pizzas`)
- Lista todas as pizzas do backend
- Grid responsivo com cards visuais
- Links para adicionar ao carrinho

### 3. Gerenciar Pizzas (`/gerenciar-pizzas`)
- CRUD completo de pizzas
- Formulários com validação
- Tabela com ações de editar/excluir

### 4. Carrinho (`/carrinho`)
- Lista itens do carrinho do backend
- Adiciona/remove itens
- Atualiza quantidades
- Calcula total automaticamente

## Configuração do Backend

### Requisitos
- Spring Boot rodando na porta 8080
- CORS configurado para `http://localhost:3000`
- Banco de dados MySQL conectado

### Verificar se está rodando
```bash
# Testar endpoint
curl http://localhost:8080/pizzas

# Verificar logs
tail -f backend/logs/application.log
```

## Troubleshooting

### Problemas Comuns

1. **Backend não responde**
   - Verificar se Spring Boot está rodando
   - Verificar porta 8080
   - Verificar logs do backend

2. **Erro de CORS**
   - Verificar configuração `@CrossOrigin` no backend
   - Verificar se frontend está na porta 3000

3. **Dados não carregam**
   - Verificar conexão com banco de dados
   - Verificar se tabelas existem
   - Verificar logs do backend

### Logs Úteis
```javascript
// No frontend
console.error('Erro na requisição:', error);

// No backend
logging.level.com.pizzaria.backend=DEBUG
```

## Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar cache para melhor performance
- [ ] Implementar retry automático em falhas
- [ ] Adicionar interceptors para logs
- [ ] Implementar websockets para atualizações em tempo real 