import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pizzaAPI } from "../services/api";
import pizzaIlustrativa from '../imgs/pizza-ilustrativa.jpg';

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
    document.title = "SantaPizza - O Sabor da Itália";
  }, []);

  // Pizzas populares (primeiras 3 do banco ou pizzas padrão se não houver dados)
  const pizzasPopulares = pizzas.slice(0, 3);

  return (
    <div className="home-container" style={{ background: 'linear-gradient(120deg, #008C45 0%, #fff 60%, #CD212A 100%)', minHeight: '100vh', padding: 0 }}>
      <div className="container" style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 0 20px' }}>
        <h1 style={{ color: '#008C45', fontWeight: 900, fontSize: '3rem', letterSpacing: 2, marginBottom: 10, textShadow: '1px 1px 0 #fff' }}>
          Santa<span style={{ color: '#CD212A' }}>Pizza</span> <span style={{ fontSize: 32 }}>🇮🇹</span>
        </h1>
        <h2 style={{ color: '#CD212A', fontWeight: 400, fontSize: '1.5rem', marginBottom: 30, fontStyle: 'italic', textShadow: '1px 1px 0 #fff' }}>
          O verdadeiro sabor da Itália na sua mesa
        </h2>
        <div className="cta-buttons">
          <Link to="/pizzas" className="btn btn-primary" style={{ background: '#008C45', color: '#fff', borderRadius: 30, fontWeight: 700, fontSize: 20, padding: '15px 40px', marginRight: 10, boxShadow: '0 2px 8px #008C4533' }}>
            Ver Cardápio
          </Link>
          <Link to="/carrinho" className="btn btn-secondary" style={{ background: '#CD212A', color: '#fff', borderRadius: 30, fontWeight: 700, fontSize: 20, padding: '15px 40px', marginLeft: 10, boxShadow: '0 2px 8px #CD212A33' }}>
            Ver Carrinho
          </Link>
        </div>
        <div className="popular-pizzas" style={{ marginTop: 60 }}>
          <h2 style={{ color: '#008C45', fontWeight: 700, fontSize: '2rem', marginBottom: 30, textShadow: '1px 1px 0 #fff' }}>Pizzas Mais Populares</h2>
          
          {loading ? (
            <div className="loading">Carregando pizzas...</div>
          ) : error ? (
            <div className="alert alert-danger">
              {error}
              <br />
              <small>Certifique-se de que o backend está rodando na porta 8080</small>
            </div>
          ) : pizzasPopulares.length > 0 ? (
            <div className="pizza-grid">
              {pizzasPopulares.map((pizza) => (
                <div key={pizza.id} className="pizza-card">
                  <img src={pizzaIlustrativa} alt="Pizza" className="pizza-image" style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px'}} />
                  <h3>{pizza.nome}</h3>
                  <p>{pizza.descricao}</p>
                  <span className="price">R$ {Number(pizza.preco).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="pizza-grid">
              <div className="pizza-card">
                <img src={pizzaIlustrativa} alt="Pizza" className="pizza-image" style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px'}} />
                <h3>Margherita</h3>
                <p>Molho de tomate, mussarela fresca, manjericão e azeite</p>
                <span className="price">R$ 25,90</span>
              </div>
              <div className="pizza-card">
                <img src={pizzaIlustrativa} alt="Pizza" className="pizza-image" style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px'}} />
                <h3>Pepperoni</h3>
                <p>Molho de tomate, mussarela e pepperoni picante</p>
                <span className="price">R$ 32,90</span>
              </div>
              <div className="pizza-card">
                <img src={pizzaIlustrativa} alt="Pizza" className="pizza-image" style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px'}} />
                <h3>Calabresa</h3>
                <p>Molho de tomate, mussarela, calabresa e cebola</p>
                <span className="price">R$ 28,90</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
