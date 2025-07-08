import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pizzaAPI, carrinhoAPI } from "../services/api";

function TodosOsItens() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const data = await pizzaAPI.getAll();
        setPizzas(data);
        setError("");
      } catch (err) {
        console.error('Erro ao carregar pizzas:', err);
        setError("Erro ao carregar pizzas. Verifique se o backend está rodando.");
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  useEffect(() => {
    document.title = "Cardápio";
  }, []);

  // Função para adicionar pizza ao carrinho
  const handleAdicionarCarrinho = async (pizza) => {
    setMensagem("");
    try {
      const clienteId = localStorage.getItem("clienteId") || 1;
      const itemData = {
        pizzaId: pizza.id,
        quantidade: 1,
        preco: pizza.preco
      };
      await carrinhoAPI.adicionarItem(itemData, clienteId);
      setMensagem(`Pizza '${pizza.nome}' adicionada ao carrinho!`);
      navigate("/carrinho"); // Redireciona imediatamente após adicionar
    } catch (err) {
      setMensagem("Erro ao adicionar ao carrinho. Verifique se está logado e se o backend está rodando.");
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 700, color: '#ffe066', marginBottom: '32px' }}>
          Cardápio de Pizzas - SANTA PIZZA
        </h1>
        <p className="text-center mb-4" style={{ fontSize: '1.2rem', color: '#555', marginBottom: '32px' }}>
          Confira nossa seleção de pizzas artesanais feitas com ingredientes frescos
        </p>
        <div className="pizzas-grid">
          {loading ? (
            <div className="loading">Carregando cardápio...</div>
          ) : error ? (
            <div className="alert alert-danger">
              {error}
              <br />
              <small>Certifique-se de que o backend está rodando na porta 8080</small>
            </div>
          ) : pizzas.length === 0 ? (
            <div className="empty-state">
              <h3 style={{ color: '#ffe066', fontWeight: 700 }}>Nenhuma pizza disponível</h3>
              <p style={{ color: '#555' }}>Nenhuma pizza foi cadastrada ainda.</p>
              <Link to="/nova-pizza" className="btn btn-primary">
                Cadastrar Primeira Pizza
              </Link>
            </div>
          ) : (
            pizzas.map((pizza) => (
              <div key={pizza.id} className="pizza-card">
                <div className="pizza-info">
                  <h3>{pizza.nome}</h3>
                  <p style={{ color: '#555', margin: '16px 0' }}>{pizza.descricao}</p>
                  <div className="ingredients" style={{ marginBottom: '12px' }}>
                    <strong>Ingredientes:</strong>
                    <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none', color: '#444', fontSize: '1rem' }}>
                      {pizza.descricao?.split(',').map((ingrediente, index) => (
                        <li key={index} style={{ marginBottom: 2 }}>{ingrediente.trim()}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="price" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>R$ {Number(pizza.preco).toFixed(2)}</div>
                  <div className="pizza-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAdicionarCarrinho(pizza)}
                      type="button"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-4">
          <Link to="/carrinho" className="btn btn-success btn-lg">
            Ver Meu Carrinho
          </Link>
        </div>
        {mensagem && (
          <div className={`alert alert-${mensagem.includes('adicionada') ? 'success' : 'danger'}`}>
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
}

export default TodosOsItens;
