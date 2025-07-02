"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pizzaAPI } from "../services/api";

function CrudPizzas({ modoCriacao }) {
  const [pizzas, setPizzas] = useState([]);
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "" });
  const [editId, setEditId] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      const data = await pizzaAPI.getAll();
      setPizzas(data);
    } catch (err) {
      console.error('Erro ao buscar pizzas:', err);
      setMensagem("Erro ao buscar pizzas. Verifique se o backend está rodando.");
      setTipoMensagem("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!modoCriacao) {
      fetchPizzas();
    }
    document.title = modoCriacao ? "Cadastrar Pizza" : "Gerenciar Pizzas";
  }, [modoCriacao]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);
    
    try {
      const pizzaData = {
        nome: form.nome,
        descricao: form.descricao,
        preco: Number.parseFloat(form.preco),
      };

      if (editId) {
        await pizzaAPI.update(editId, pizzaData);
        setMensagem("Pizza atualizada com sucesso!");
      } else {
        await pizzaAPI.create(pizzaData);
        setMensagem("Pizza cadastrada com sucesso!");
      }
      
      setTipoMensagem("success");
      setForm({ nome: "", descricao: "", preco: "" });
      setEditId(null);
      
      if (!modoCriacao) {
        fetchPizzas();
      }

      // Redirect to home page after creating new item
      if (!editId) {
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      console.error('Erro ao salvar pizza:', err);
      setMensagem("Erro ao salvar pizza. Verifique se o backend está rodando.");
      setTipoMensagem("error");
    } finally {
      setLoading(false);
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
      setLoading(true);
      await pizzaAPI.delete(id);
      setMensagem("Pizza excluída com sucesso!");
      setTipoMensagem("success");
      fetchPizzas();
    } catch (err) {
      console.error('Erro ao excluir pizza:', err);
      setMensagem("Erro ao excluir pizza. Verifique se o backend está rodando.");
      setTipoMensagem("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h1>
          {modoCriacao ? "🍕 Cadastrar Nova Pizza" : "🍕 Gerenciar Pizzas"}
        </h1>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome da Pizza</label>
              <input
                id="nome"
                name="nome"
                placeholder="Ex: Margherita"
                value={form.nome}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="descricao">Descrição dos Ingredientes</label>
              <textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva os ingredientes da pizza"
                value={form.descricao}
                onChange={handleChange}
                rows="3"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="preco">Preço (R$)</label>
              <input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.preco}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "⏳ Processando..." : editId ? "✏️ Atualizar Pizza" : "➕ Cadastrar Pizza"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditId(null);
                    setForm({ nome: "", descricao: "", preco: "" });
                    setMensagem("");
                  }}
                  disabled={loading}
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </form>

          {mensagem && (
            <div className={`alert alert-${tipoMensagem === "success" ? "success" : "danger"} mt-3`}>
              {mensagem}
            </div>
          )}
        </div>

        {!modoCriacao && (
          <div className="mt-4">
            <h2>📋 Lista de Pizzas</h2>
            
            {loading ? (
              <div className="loading">Carregando pizzas...</div>
            ) : pizzas.length === 0 ? (
              <div className="empty-state">
                <h3>🍕 Nenhuma pizza cadastrada</h3>
                <p>Comece cadastrando a primeira pizza!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
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
                        <td className="text-primary fw-bold">{pizza.nome}</td>
                        <td>{pizza.descricao}</td>
                        <td className="text-success fw-bold">
                          R$ {Number(pizza.preco).toFixed(2)}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleEdit(pizza)}
                              disabled={loading}
                            >
                              ✏️ Editar
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(pizza.id)}
                              disabled={loading}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CrudPizzas;
