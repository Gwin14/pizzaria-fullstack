"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pizzeria-theme.css";

function ClienteCadastro() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);

    try {
      const resp = await fetch("http://localhost:8080/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!resp.ok) throw new Error("Erro ao cadastrar cliente");

      const data = await resp.json();
      localStorage.setItem("clienteId", data.id);
      setMensagem(
        `Bem-vindo à nossa pizzaria! Cliente cadastrado com sucesso! ID: ${data.id}`
      );
      setTipoMensagem("success");

      // Redirect to home page after successful registration
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMensagem("Erro: " + err.message);
      setTipoMensagem("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pizzeria-container">
      <div className="pizzeria-card">
        <h1 className="pizzeria-title">👤 Cadastro de Cliente</h1>
        <p
          style={{
            textAlign: "center",
            color: "var(--pizzeria-brown)",
            fontSize: "1.1rem",
            marginBottom: "30px",
          }}
        >
          Junte-se à nossa família e desfrute das melhores pizzas da cidade!
        </p>

        <form onSubmit={handleSubmit} className="pizzeria-form">
          <input
            name="nome"
            placeholder="Seu nome completo"
            value={form.nome}
            onChange={handleChange}
            className="pizzeria-input"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Seu melhor e-mail"
            value={form.email}
            onChange={handleChange}
            className="pizzeria-input"
            required
          />
          <input
            name="telefone"
            placeholder="Telefone com DDD (ex: 11999999999)"
            value={form.telefone}
            onChange={handleChange}
            className="pizzeria-input"
            required
          />
          <button
            type="submit"
            className="pizzeria-btn pizzeria-btn-primary"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "⏳ Cadastrando..." : "🍕 Cadastrar e Começar a Pedir"}
          </button>
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
      </div>
    </div>
  );
}

export default ClienteCadastro;
