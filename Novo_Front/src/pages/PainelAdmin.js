"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pizzeria-theme.css";

function PainelAdmin() {
  const [clientes, setClientes] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [carrinhos, setCarrinhos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("clienteEmail");
    if (email !== "admin@email.com") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/clientes").then((r) => r.json()),
      fetch("http://localhost:8080/pizzas").then((r) => r.json()),
      fetch("http://localhost:8080/carrinho").then((r) => r.json()),
      fetch("http://localhost:8080/pedidos/all").then((r) => r.json()),
    ])
      .then(([clientesData, pizzasData, carrinhosData, pedidosData]) => {
        setClientes(clientesData);
        setPizzas(pizzasData);
        setCarrinhos(carrinhosData);
        setPedidos(pedidosData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = "Admin";
  }, []);

  const handleDelete = async (tipo, id) => {
    const urls = {
      cliente: `http://localhost:8080/clientes/${id}`,
      pizza: `http://localhost:8080/pizzas/${id}`,
      carrinho: `http://localhost:8080/carrinho/${id}`,
      pedido: `http://localhost:8080/pedidos/${id}`,
    };

    if (!window.confirm(`Deseja realmente excluir este ${tipo}?`)) return;

    try {
      await fetch(urls[tipo], { method: "DELETE" });
      setMensagem(
        `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} excluído com sucesso!`
      );
      setTipoMensagem("success");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setMensagem(`Erro ao excluir ${tipo}`);
      setTipoMensagem("error");
    }
  };

  if (loading) {
    return (
      <div className="pizzeria-container">
        <div className="pizzeria-card">
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⏳</div>
            <h2>Carregando painel administrativo...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pizzeria-container">
      <h1 className="pizzeria-title">🏪 Painel Administrativo</h1>

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

      <div className="pizzeria-admin-grid">
        {/* Clientes */}
        <div className="pizzeria-admin-card">
          <div className="pizzeria-admin-header">
            <h3>👥 Clientes ({clientes.length})</h3>
            <button
              className="pizzeria-btn pizzeria-btn-primary"
              style={{ padding: "8px 16px", fontSize: "14px" }}
              onClick={() => navigate("/novo-cliente")}
            >
              ➕ Novo
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="pizzeria-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td style={{ fontWeight: "600" }}>{c.nome}</td>
                    <td>{c.email}</td>
                    <td>{c.telefone}</td>
                    <td>
                      <button
                        className="pizzeria-btn pizzeria-btn-danger"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                        onClick={() => handleDelete("cliente", c.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pizzas */}
        <div className="pizzeria-admin-card">
          <div className="pizzeria-admin-header">
            <h3>🍕 Pizzas ({pizzas.length})</h3>
            <button
              className="pizzeria-btn pizzeria-btn-primary"
              style={{ padding: "8px 16px", fontSize: "14px" }}
              onClick={() => navigate("/nova-pizza")}
            >
              ➕ Nova
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="pizzeria-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pizzas.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td
                      style={{
                        fontWeight: "600",
                        color: "var(--pizzeria-red)",
                      }}
                    >
                      {p.nome}
                    </td>
                    <td>{p.descricao}</td>
                    <td className="pizzeria-price" style={{ fontSize: "1rem" }}>
                      R$ {Number(p.preco).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="pizzeria-btn pizzeria-btn-primary"
                        style={{ padding: "6px 12px", fontSize: "12px", marginRight: "6px" }}
                        onClick={() => navigate(`/editar-pizza/${p.id}`)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="pizzeria-btn pizzeria-btn-danger"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                        onClick={() => handleDelete("pizza", p.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Carrinhos */}
        <div className="pizzeria-admin-card">
          <div className="pizzeria-admin-header">
            <h3>🛒 Carrinhos ({carrinhos.length})</h3>
            <button
              className="pizzeria-btn pizzeria-btn-primary"
              style={{ padding: "8px 16px", fontSize: "14px" }}
              onClick={() => navigate("/novo-carrinho")}
            >
              
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="pizzeria-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Itens</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {carrinhos.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td>
                      <div style={{ display: "grid", gap: "5px" }}>
                        {(c.itens || []).map((i) => (
                          <div
                            key={i.id}
                            style={{
                              background: "var(--pizzeria-cream)",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              fontSize: "12px",
                            }}
                          >
                            Pizza #{i.pizzaId} - Qtd: {i.quantidade} -
                            <span style={{ color: "var(--pizzeria-orange)" }}>
                              R$ {Number(i.preco).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        className="pizzeria-btn pizzeria-btn-danger"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                        onClick={() => handleDelete("carrinho", c.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pedidos */}
        <div className="pizzeria-admin-card">
          <div className="pizzeria-admin-header">
            <h3>📋 Pedidos ({pedidos.length})</h3>
            <button
              className="pizzeria-btn pizzeria-btn-primary"
              style={{ padding: "8px 16px", fontSize: "14px" }}
              onClick={() => navigate("/novo-pedido")}
            >
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="pizzeria-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Itens</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td style={{ fontWeight: "600" }}>{p.cliente?.nome}</td>
                    <td>
                      <span
                        style={{
                          background:
                            p.status === "FINALIZADO"
                              ? "var(--pizzeria-red)"
                              : "var(--pizzeria-yellow)",
                          color:
                            p.status === "FINALIZADO"
                              ? "white"
                              : "var(--pizzeria-dark)",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {p.data?.replace("T", " ")}
                    </td>
                    <td>
                      <div style={{ display: "grid", gap: "3px" }}>
                        {(p.itens || []).map((i) => (
                          <div
                            key={i.id}
                            style={{
                              background: "var(--pizzeria-cream)",
                              padding: "3px 8px",
                              borderRadius: "3px",
                              fontSize: "11px",
                            }}
                          >
                            Pizza #{i.pizzaId} - Qtd: {i.quantidade} -
                            <span style={{ color: "var(--pizzeria-red)" }}>
                              R$ {Number(i.preco).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        className="pizzeria-btn pizzeria-btn-danger"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                        onClick={() => handleDelete("pedido", p.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PainelAdmin;
