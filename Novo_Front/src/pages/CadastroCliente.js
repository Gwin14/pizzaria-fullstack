import React, { useState, useEffect } from "react";
import { clienteAPI, carrinhoAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CadastroCliente() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", senha: "" });
  const [mensagem, setMensagem] = useState("");
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
      const cliente = await clienteAPI.create(form);
      setMensagem("Cadastro realizado com sucesso! Redirecionando...");
      // Login automático
      localStorage.setItem("clienteId", cliente.id);
      localStorage.setItem("clienteNome", cliente.nome);
      // Buscar carrinho do cliente
      const carrinhos = await carrinhoAPI.getAll();
      const carrinho = carrinhos.find((c) => c.cliente && c.cliente.id === cliente.id);
      if (carrinho) {
        localStorage.setItem("carrinhoId", carrinho.id);
      } else {
        localStorage.removeItem("carrinhoId");
      }
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setMensagem("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Cadastro de Cliente";
  }, []);

  return (
    <div className="page-container">
      <div className="container">
        <div className="form-container">
          <h2>Cadastro</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
          {mensagem && <div className="alert alert-info mt-3">{mensagem}</div>}
          <div className="mt-3 text-center">
            <span>Já tem conta? </span>
            <a href="/login-cliente">Entrar</a>
          </div>
        </div>
      </div>
    </div>
  );
}