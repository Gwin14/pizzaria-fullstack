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
      <div className="pizzeria-card" style={{ marginTop: "30px" }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
          <p>Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pizzeria-card" style={{ marginTop: "30px" }}>
      <h2 className="pizzeria-subtitle">📚 Histórico de Pedidos</h2>

      {pedidos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "var(--pizzeria-brown)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🍕</div>
          <p style={{ fontSize: "1.2rem" }}>Nenhum pedido encontrado ainda.</p>
          <p>Que tal fazer seu primeiro pedido?</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="pizzeria-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Status</th>
                <th>Itens</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td style={{ fontWeight: "600" }}>#{pedido.id}</td>
                  <td>{pedido.data?.replace("T", " ")}</td>
                  <td>
                    <span
                      style={{
                        background:
                          pedido.status === "FINALIZADO"
                            ? "var(--pizzeria-red)"
                            : "var(--pizzeria-yellow)",
                        color:
                          pedido.status === "FINALIZADO"
                            ? "white"
                            : "var(--pizzeria-dark)",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {pedido.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {pedido.itens?.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            background: "var(--pizzeria-cream)",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            fontSize: "14px",
                          }}
                        >
                          <strong>Pizza #{item.pizzaId}</strong> - Qtd:{" "}
                          {item.quantidade} -
                          <span
                            style={{
                              color: "var(--pizzeria-red)",
                              fontWeight: "600",
                            }}
                          >
                            R$ {item.preco.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoricoPedidos;
