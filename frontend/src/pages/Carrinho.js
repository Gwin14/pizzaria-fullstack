import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

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
  }, [carrinhoId, location.key]);

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
    <div className="main-content">
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 700, color: '#ffe066', marginBottom: '32px' }}>
        Carrinho de Compras
      </h1>
      {mensagem && (
        <div className={`alert alert-${mensagem.includes('sucesso') ? 'success' : 'danger'}`} style={{ textAlign: 'center', marginBottom: 24 }}>
          {mensagem}
        </div>
      )}
      <div className="form-container" style={{ maxWidth: 500, margin: '0 auto 40px auto', background: '#fff', border: '2px solid #ffe066', borderRadius: 24, padding: 32 }}>
        <h2 style={{ textAlign: 'center', color: '#ffe066', fontWeight: 700, marginBottom: 24 }}>Adicionar Pizza ao Carrinho</h2>
        <form onSubmit={adicionarItem}>
          <div className="form-group">
            <label htmlFor="pizzaId">Selecionar Pizza</label>
            <select
              id="pizzaId"
              value={pizzaId}
              onChange={(e) => setPizzaId(e.target.value)}
              required
              disabled={loading}
              style={{ borderRadius: 10, padding: 12, fontSize: '1.1rem', marginBottom: 16 }}
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
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
              style={{ borderRadius: 10, padding: 12, fontSize: '1.1rem', marginBottom: 16 }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            Adicionar ao Carrinho
          </button>
        </form>
      </div>
      <h2 style={{ textAlign: 'center', color: '#ffe066', fontWeight: 700, margin: '40px 0 24px 0' }}>Itens no Carrinho</h2>
      <div className="pizzas-grid" style={{ marginBottom: 40 }}>
        {itens.length === 0 ? (
          <div className="pizza-card" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
            <h3 style={{ color: '#ffe066', fontWeight: 700 }}>Seu carrinho está vazio</h3>
            <p style={{ color: '#555' }}>Adicione pizzas para começar seu pedido!</p>
          </div>
        ) : (
          itens.map((item) => (
            <div key={item.id} className="pizza-card" style={{ position: 'relative' }}>
              <h3>{item.pizzaNome}</h3>
              <p style={{ color: '#555', margin: '12px 0' }}>{item.pizzaDescricao}</p>
              <div style={{ marginBottom: 10 }}>Qtd: <strong>{item.quantidade}</strong></div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>R$ {(item.pizzaPreco * item.quantidade).toFixed(2)}</div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn-danger" style={{ padding: '8px 18px', fontSize: '1rem' }} onClick={() => removerItem(item.id)} disabled={loading}>
                  Remover
                </button>
                <button className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '1rem' }} onClick={() => atualizarQuantidade({ ...item, quantidade: item.quantidade + 1 })} disabled={loading}>
                  +
                </button>
                <button className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '1rem' }} onClick={() => atualizarQuantidade({ ...item, quantidade: Math.max(1, item.quantidade - 1) })} disabled={loading}>
                  -
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffe066', marginBottom: 8 }}>Total do Pedido</div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#222', marginBottom: 24 }}>R$ {total.toFixed(2)}</div>
        <Link to="/finalizar-pedido" className="btn btn-success btn-lg" style={{ fontSize: '1.2rem', padding: '16px 40px' }}>
          Finalizar Pedido
        </Link>
      </div>
    </div>
  );
}

export default Carrinho;
