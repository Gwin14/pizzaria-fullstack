"use client";

import { useEffect, useState } from "react";
import "../styles/pizzeria-theme.css";

function HistoricoPedidos({ clienteId }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clienteId) {
      fetch(`http://localhost:8080/pedidos?clienteId=${clienteId}`)
        .then((r) => r.json())
        .then((data) => {
          setPedidos(data);
          setLoading(false);
        })
        .catch(() => {
          setPedidos([]);
          setLoading(false);
        });
    }
  }, [clienteId]);

  useEffect(() => {
    document.title = "Meus Pedidos";
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "2rem", marginBottom: "10px", color: '#ffe066' }}>Carregando histórico...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 700, color: '#ffe066', marginBottom: '32px' }}>
        Histórico de Pedidos
      </h1>
      {pedidos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}>
          <h3 style={{ color: '#ffe066', fontWeight: 700, marginBottom: 16 }}>Nenhum pedido encontrado ainda.</h3>
          <p style={{ fontSize: "1.2rem" }}>Que tal fazer seu primeiro pedido?</p>
        </div>
      ) : (
        <div className="pizzas-grid">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="pizza-card" style={{ textAlign: 'left', padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffe066' }}>Pedido #{pedido.id}</div>
                <div style={{ fontSize: '1rem', color: '#888' }}>{pedido.data?.replace('T', ' ')}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{
                  background: pedido.status === 'FINALIZADO' ? '#ff6b6b' : '#ffe066',
                  color: pedido.status === 'FINALIZADO' ? 'white' : '#222',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}>{pedido.status}</span>
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Itens:</strong>
                <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none', color: '#444', fontSize: '1rem' }}>
                  {pedido.itens?.map((item) => (
                    <li key={item.id} style={{ marginBottom: 2 }}>
                      Pizza #{item.pizzaId} - Qtd: {item.quantidade} - <span style={{ color: '#ff6b6b', fontWeight: 600 }}>R$ {item.preco.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#222' }}>
                Total: R$ {pedido.itens?.reduce((sum, i) => sum + (i.preco * i.quantidade), 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoricoPedidos;
