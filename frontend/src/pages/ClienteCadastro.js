import React, { useState } from "react";

function ClienteCadastro() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
  const [clienteId, setClienteId] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    try {
      const resp = await fetch("http://localhost:8080/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!resp.ok) throw new Error("Erro ao cadastrar cliente");
      const data = await resp.json();
      setClienteId(data.id);
      localStorage.setItem("clienteId", data.id);
      setMensagem("Cliente cadastrado com sucesso! ID: " + data.id);
    } catch (err) {
      setMensagem("Erro: " + err.message);
    }
  };

  return (
    <div>
      <h2>Cadastro de Cliente</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default ClienteCadastro;
