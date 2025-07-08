import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pizzaAPI } from "../services/api";

export default function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const data = await pizzaAPI.getAll();
        setPizzas(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar pizzas:', err);
        setError('Erro ao carregar pizzas. Verifique se o backend está rodando.');
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  useEffect(() => {
    document.title = "Home";
  }, []);

  // Pizzas populares (primeiras 3 do banco ou pizzas padrão se não houver dados)
  const pizzasPopulares = pizzas.slice(0, 3);

  return (
    <div className="home-container">
      <div className="main-content">
        <h1>Bem-vindo à SANTA PIZZA</h1>
        <p style={{ fontSize: '1.3rem', textAlign: 'center', margin: '32px 0 40px 0', color: '#555' }}>
          Descubra as melhores pizzas artesanais feitas com ingredientes frescos e receitas tradicionais.
        </p>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '48px' }}>
          <Link to="/pizzas" className="btn btn-primary">
            Ver Cardápio
          </Link>
          <Link to="/carrinho" className="btn btn-secondary">
            Ver Carrinho
          </Link>
        </div>
        <div className="pizza-grid">
          {loading ? (
            <div className="loading">Carregando pizzas...</div>
          ) : error ? (
            <div className="alert alert-danger">
              {error}
              <br />
              <small>Certifique-se de que o backend está rodando na porta 8080</small>
            </div>
          ) : pizzasPopulares.length > 0 ? (
            pizzasPopulares.map((pizza) => (
              <div key={pizza.id} className="pizza-card">
                <h3>{pizza.nome}</h3>
                <p style={{ color: '#555', margin: '16px 0' }}>{pizza.descricao}</p>
                <span className="price" style={{ fontSize: '1.3rem', fontWeight: 700 }}>R$ {Number(pizza.preco).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <>
              <div className="pizza-card">
                <h3>Margherita</h3>
                <p style={{ color: '#555', margin: '16px 0' }}>Molho de tomate, mussarela fresca, manjericão e azeite</p>
                <span className="price" style={{ fontSize: '1.3rem', fontWeight: 700 }}>R$ 25,90</span>
              </div>
              <div className="pizza-card">
                <h3>Pepperoni</h3>
                <p style={{ color: '#555', margin: '16px 0' }}>Molho de tomate, mussarela e pepperoni picante</p>
                <span className="price" style={{ fontSize: '1.3rem', fontWeight: 700 }}>R$ 32,90</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
