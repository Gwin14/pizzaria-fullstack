"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pizzeria-theme.css";

function FinalizarPedido({ clienteId, carrinhoId, onPedidoFinalizado }) {
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Finalizar Pedido";
  }, []);

  const finalizar = async () => {
    setMensagem("");
    setLoading(true);

    if (!clienteId || !carrinhoId) {
      setMensagem("❌ Erro: Faça login e tente novamente.");
      setTipoMensagem("error");
      setLoading(false);
      return;
    }

    try {
      const resp = await fetch(
        `http://localhost:8080/pedidos?clienteId=${clienteId}&carrinhoId=${carrinhoId}`,
        {
          method: "POST",
        }
      );

      if (!resp.ok) throw new Error("Erro ao finalizar pedido");

      const data = await resp.json();
      setPedido(data);
      setMensagem(
        "🎉 Pedido realizado com sucesso! Sua pizza está sendo preparada com carinho!"
      );
      setTipoMensagem("success");

      if (onPedidoFinalizado) onPedidoFinalizado(data);
    } catch (err) {
      setMensagem("❌ Erro: " + err.message);
      setTipoMensagem("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pizzeria-card" style={{ marginTop: "30px" }}>
      <h3 className="pizzeria-subtitle">🛒 Finalizar Pedido</h3>

      <button
        onClick={finalizar}
        className="pizzeria-btn pizzeria-btn-primary pizzeria-pulse"
        disabled={loading}
        style={{
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        {loading ? "⏳ Finalizando..." : "🍕 Finalizar Pedido"}
      </button>

      {mensagem && (
        <div
          className={`pizzeria-message ${
            tipoMensagem === "success"
              ? "pizzeria-message-success"
              : "pizzeria-message-error"
          }`}
        >
          {mensagem}
        </div>
      )}

      {pedido && (
        <div className="pizzeria-item-card">
          <h4
            style={{
              color: "var(--pizzeria-red)",
              fontFamily: "Playfair Display, serif",
              marginBottom: "20px",
            }}
          >
            📋 Resumo do Pedido
          </h4>
          <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
            <p>
              <strong>🆔 ID do Pedido:</strong> #{pedido.id}
            </p>
            <p>
              <strong>📊 Status:</strong>
              <span
                style={{
                  color: "var(--pizzeria-red)",
                  fontWeight: "600",
                  marginLeft: "8px",
                }}
              >
                {pedido.status}
              </span>
            </p>
            <p>
              <strong>📅 Data:</strong> {pedido.data?.replace("T", " ")}
            </p>
          </div>

          <h5 style={{ color: "var(--pizzeria-brown)", marginBottom: "15px" }}>
            🍕 Itens do Pedido:
          </h5>
          <div style={{ display: "grid", gap: "10px" }}>
            {pedido.itens?.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "var(--pizzeria-cream)",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid var(--pizzeria-light-brown)",
                }}
              >
                <strong>Pizza #{item.pizzaId}</strong> - Quantidade:{" "}
                {item.quantidade} -
                <span className="pizzeria-price" style={{ fontSize: "1rem" }}>
                  R$ {item.preco.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FinalizarPedido;
