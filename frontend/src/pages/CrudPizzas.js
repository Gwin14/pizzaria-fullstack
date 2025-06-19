import React, { useEffect, useState } from "react";

function CrudPizzas({ modoCriacao }) {
  const [pizzas, setPizzas] = useState([]);
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "" });
  const [editId, setEditId] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const fetchPizzas = () => {
    fetch("http://localhost:8080/pizzas")
      .then((r) => r.json())
      .then(setPizzas)
      .catch(() => setMensagem("Erro ao buscar pizzas"));
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
          preco: parseFloat(form.preco),
        }),
      });
      if (!resp.ok) throw new Error("Erro ao salvar pizza");
      setMensagem(editId ? "Pizza atualizada!" : "Pizza cadastrada!");
      setForm({ nome: "", descricao: "", preco: "" });
      setEditId(null);
      fetchPizzas();
    } catch (err) {
      setMensagem("Erro: " + err.message);
    }
  };

  const handleEdit = (pizza) => {
    setForm({
      nome: pizza.nome,
      descricao: pizza.descricao,
      preco: pizza.preco,
    });
    setEditId(pizza.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir?")) return;
    await fetch(`http://localhost:8080/pizzas/${id}`, { method: "DELETE" });
    fetchPizzas();
  };

  return (
    <div style={{ margin: 30 }}>
      <h2>
        {modoCriacao ? "Cadastrar Nova Pizza" : "Cadastro e Listagem de Pizzas"}
      </h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          required
        />
        <input
          name="preco"
          type="number"
          step="0.01"
          placeholder="Preço"
          value={form.preco}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? "Atualizar" : "Cadastrar"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ nome: "", descricao: "", preco: "" });
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      {mensagem && <p>{mensagem}</p>}
      {!modoCriacao && (
        <table border="1" cellPadding={5} style={{ width: "100%" }}>
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
                <td>{pizza.id}</td>
                <td>{pizza.nome}</td>
                <td>{pizza.descricao}</td>
                <td>R$ {Number(pizza.preco).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(pizza)}>Editar</button>
                  <button onClick={() => handleDelete(pizza.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CrudPizzas;
