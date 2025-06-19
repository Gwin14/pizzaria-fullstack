"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pizzeria-theme.css";

function CrudPizzas({ modoCriacao }) {
  const [pizzas, setPizzas] = useState([]);
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "" });
  const [editId, setEditId] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const navigate = useNavigate();

  const fetchPizzas = () => {
    fetch("http://localhost:8080/pizzas")
      .then((r) => r.json())
      .then(setPizzas)
      .catch(() => {
        setMensagem("Erro ao buscar pizzas");
        setTipoMensagem("error");
      });
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:8080/pizzas/${editId}`
      : "http://localhost:8080/pizzas";

    try {
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          descricao: form.descricao,
          preco: Number.parseFloat(form.preco),
        }),
      });

      if (!resp.ok) throw new Error("Erro ao salvar pizza");

      const successMessage = editId
        ? "Pizza atualizada com sucesso!"
        : "Pizza cadastrada com sucesso!";
      setMensagem(successMessage);
      setTipoMensagem("success");
      setForm({ nome: "", descricao: "", preco: "" });
      setEditId(null);
      fetchPizzas();

      // Redirect to home page after creating new item
      if (!editId) {
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      setMensagem("Erro: " + err.message);
      setTipoMensagem("error");
    }
  };

  const handleEdit = (pizza) => {
    setForm({
      nome: pizza.nome,
      descricao: pizza.descricao,
      preco: pizza.preco,
    });
    setEditId(pizza.id);
    setMensagem("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta pizza?")) return;

    try {
      await fetch(`http://localhost:8080/pizzas/${id}`, { method: "DELETE" });
      setMensagem("Pizza excluída com sucesso!");
      setTipoMensagem("success");
      fetchPizzas();
    } catch (err) {
      setMensagem("Erro ao excluir pizza");
      setTipoMensagem("error");
    }
  };

  return (
    <div className="pizzeria-container">
      <div className="pizzeria-card">
        <h1 className="pizzeria-title">
          {modoCriacao ? "🍕 Cadastrar Nova Pizza" : "🍕 Gerenciar Pizzas"}
        </h1>

        <form onSubmit={handleSubmit} className="pizzeria-form">
          <input
            name="nome"
            placeholder="Nome da Pizza (ex: Margherita)"
            value={form.nome}
            onChange={handleChange}
            className="pizzeria-input"
            required
          />
          <input
            name="descricao"
            placeholder="Descrição dos ingredientes"
            value={form.descricao}
            onChange={handleChange}
            className="pizzeria-input"
            required
          />
          <input
            name="preco"
            type="number"
            step="0.01"
            placeholder="Preço (R$)"
            value={form.preco}
            onChange={handleChange}
            className="pizzeria-input"
            required
          />
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button type="submit" className="pizzeria-btn pizzeria-btn-primary">
              {editId ? "✏️ Atualizar Pizza" : "➕ Cadastrar Pizza"}
            </button>
            {editId && (
              <button
                type="button"
                className="pizzeria-btn pizzeria-btn-secondary"
                onClick={() => {
                  setEditId(null);
                  setForm({ nome: "", descricao: "", preco: "" });
                  setMensagem("");
                }}
              >
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>

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

        {!modoCriacao && (
          <div>
            <h2 className="pizzeria-subtitle">📋 Lista de Pizzas</h2>
            <div style={{ overflowX: "auto" }}>
              <table className="pizzeria-table">
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
                  {pizzas.map((pizza) => (
                    <tr key={pizza.id}>
                      <td>#{pizza.id}</td>
                      <td
                        style={{
                          fontWeight: "600",
                          color: "var(--pizzeria-red)",
                        }}
                      >
                        {pizza.nome}
                      </td>
                      <td>{pizza.descricao}</td>
                      <td className="pizzeria-price">
                        R$ {Number(pizza.preco).toFixed(2)}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            className="pizzeria-btn pizzeria-btn-secondary"
                            style={{ padding: "8px 15px", fontSize: "14px" }}
                            onClick={() => handleEdit(pizza)}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="pizzeria-btn pizzeria-btn-danger"
                            style={{ padding: "8px 15px", fontSize: "14px" }}
                            onClick={() => handleDelete(pizza.id)}
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CrudPizzas;
