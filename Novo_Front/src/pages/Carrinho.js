import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { carrinhoAPI, pizzaAPI } from "../services/api";

function Carrinho() {
  const [itens, setItens] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [pizzaId, setPizzaId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [preco, setPreco] = useState(0);
  const [loading, setLoading] = useState(true);
  const clienteId = localStorage.getItem("clienteId") || 1;
  const carrinhoId = localStorage.getItem("carrinhoId");

  // Busca pizzas disponíveis
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const data = await pizzaAPI.getAll();
        setPizzas(data);
      } catch (err) {
        console.error('Erro ao carregar pizzas:', err);
      }
    };
    fetchPizzas();
  }, []);

  // Busca itens do carrinho
  useEffect(() => {
    const fetchItens = async () => {
      if (carrinhoId) {
        try {
          setLoading(true);
          const data = await carrinhoAPI.getItens(carrinhoId);
          // Buscar detalhes das pizzas para cada item
          const pizzasMap = {};
          for (const item of data) {
            const pizzaIdNum = Number(item.pizzaId || item.pizza_id || item.pizza || item.id_pizza);
            if (pizzaIdNum && !pizzasMap[pizzaIdNum]) {
              try {
                pizzasMap[pizzaIdNum] = await pizzaAPI.getById(pizzaIdNum);
              } catch (e) {
                pizzasMap[pizzaIdNum] = null;
              }
            }
          }
          // Adiciona detalhes ao item
          const itensComDetalhes = data.map(item => {
            const pizzaIdNum = Number(item.pizzaId || item.pizza_id || item.pizza || item.id_pizza);
            return {
              ...item,
              pizzaId: pizzaIdNum || item.pizzaId,
              pizzaNome: pizzasMap[pizzaIdNum]?.nome || item.pizzaNome || `Pizza não encontrada (id: ${pizzaIdNum || item.pizzaId})`,
              pizzaDescricao: pizzasMap[pizzaIdNum]?.descricao || '',
              pizzaPreco: pizzasMap[pizzaIdNum]?.preco || item.preco
            }
          });
          setItens(itensComDetalhes);
        } catch (err) {
          console.error('Erro ao carregar itens do carrinho:', err);
          setItens([]);
        } finally {
          setLoading(false);
        }
      } else {
        setItens([]);
        setLoading(false);
      }
    };
    fetchItens();
  }, [carrinhoId]);

  // Atualiza preço quando pizza é selecionada
  useEffect(() => {
    if (pizzaId) {
      const pizza = pizzas.find(p => p.id === parseInt(pizzaId));
      if (pizza) {
        setPreco(pizza.preco);
      }
    }
  }, [pizzaId, pizzas]);

  // Adiciona pizza ao carrinho
  const adicionarItem = async (e) => {
    e.preventDefault();
    setMensagem("");
    try {
      setLoading(true);
      const itemData = {
        pizzaId: Number(pizzaId),
        quantidade: Number(quantidade),
        preco: Number(preco)
      };
      await carrinhoAPI.adicionarItem(itemData, clienteId);
      setMensagem("Item adicionado com sucesso!");
      setPizzaId("");
      setQuantidade(1);
      setPreco(0);
      // Buscar novamente o carrinho do cliente para pegar o novo carrinhoId
      const carrinhos = await carrinhoAPI.getAll();
      const carrinho = carrinhos.find((c) => c.cliente && c.cliente.id === Number(clienteId));
      if (carrinho) {
        localStorage.setItem("carrinhoId", carrinho.id);
        const data = await carrinhoAPI.getItens(carrinho.id);
        setItens(data);
      }
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      setMensagem("Erro ao adicionar item. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  // Remove item
  const removerItem = async (itemId) => {
    if (!window.confirm("Deseja remover este item do carrinho?")) return;
    
    try {
      setLoading(true);
      await carrinhoAPI.removerItem(itemId);
      setItens(itens.filter((i) => i.id !== itemId));
      setMensagem("Item removido com sucesso!");
    } catch (err) {
      console.error('Erro ao remover item:', err);
      setMensagem("Erro ao remover item. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  // Atualiza quantidade
  const atualizarQuantidade = async (item) => {
    try {
      await carrinhoAPI.atualizarQuantidade(item);
      // Atualiza lista
      const data = await carrinhoAPI.getItens(carrinhoId);
      setItens(data);
    } catch (err) {
      console.error('Erro ao atualizar quantidade:', err);
      setMensagem("Erro ao atualizar quantidade. Verifique se o backend está rodando.");
    }
  };

  const total = itens.reduce(
    (sum, i) => Number(i.preco || 0) * Number(i.quantidade || 0) + sum,
    0
  );

  useEffect(() => {
    document.title = "Carrinho";
  }, []);

  if (loading && itens.length === 0) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="loading">Carregando carrinho...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <h1>🛒 Carrinho de Compras</h1>

        {mensagem && (
          <div className={`alert alert-${mensagem.includes('sucesso') ? 'success' : 'danger'}`}>
            {mensagem}
          </div>
        )}

        <div className="form-container">
          <h2>Adicionar Pizza ao Carrinho</h2>
          <form onSubmit={adicionarItem}>
            <div className="form-group">
              <label htmlFor="pizzaId">Selecionar Pizza</label>
              <select
                id="pizzaId"
                value={pizzaId}
                onChange={(e) => setPizzaId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Escolha uma pizza</option>
                {pizzas.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>
                    {pizza.nome} - R$ {Number(pizza.preco).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="quantidade">Quantidade</label>
              <input
                id="quantidade"
                type="number"
                min={1}
                placeholder="Quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="preco">Valor(R$)</label>
              <input
                id="preco"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={preco}
                required
                disabled={loading}
                readOnly
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "⏳ Processando..." : "➕ Adicionar Pizza"}
            </button>
          </form>
        </div>

        {itens.length === 0 ? (
          <div className="empty-state">
            <h3>🛒 Seu carrinho está vazio</h3>
            <p>Adicione algumas pizzas deliciosas para começar!</p>
            <Link to="/pizzas" className="btn btn-primary">
              Ver Cardápio
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <h2>Itens no Carrinho</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Pizza</th>
                    <th>Quantidade</th>
                    <th>Preço Unit.</th>
                    <th>Subtotal</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item) => {
                    return (
                      <tr key={item.id || Math.random()}>
                        <td className="text-primary fw-bold">
                          {item.pizzaNome ? item.pizzaNome : `Pizza não encontrada (id: ${item.pizzaId})`}
                          <br />
                          <small>{item.pizzaDescricao}</small>
                        </td>
                        <td>
                          <input
                            type="number"
                            min={1}
                            value={item.quantidade}
                            onChange={(e) =>
                              atualizarQuantidade({
                                ...item,
                                quantidade: Number(e.target.value),
                              })
                            }
                            style={{ width: 80, padding: '5px', borderRadius: '3px', border: '1px solid #ddd' }}
                            disabled={loading}
                          />
                        </td>
                        <td className="text-success fw-bold">
                          R$ {Number(item.preco || 0).toFixed(2)}
                        </td>
                        <td className="text-danger fw-bold">
                          R$ {(
                            Number(item.preco || 0) * Number(item.quantidade || 0)
                          ).toFixed(2)}
                        </td>
                        <td>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => removerItem(item.id)}
                            disabled={loading}
                          >
                            🗑️ Remover
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="card mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Total do Pedido</h3>
                <h2 className="text-primary mb-0">R$ {total.toFixed(2)}</h2>
              </div>
            </div>
            
            <div className="d-flex gap-3 mt-3">
              <Link to="/pizzas" className="btn btn-secondary">
                ← Continuar Comprando
              </Link>
              <Link to="/finalizar-pedido" className="btn btn-success">
                ✅ Finalizar Pedido
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrinho;
