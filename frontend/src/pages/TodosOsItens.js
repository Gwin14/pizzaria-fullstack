import React, { useEffect, useState } from "react";

function TodosOsItens() {
  const [clientes, setClientes] = useState([]);
  const [carrinhos, setCarrinhos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/clientes")
      .then((r) => r.json())
      .then(setClientes)
      .catch(() => setErro("Erro ao buscar clientes"));
    fetch("http://localhost:8080/carrinho")
      .then((r) => r.json())
      .then(setCarrinhos)
      .catch(() => setErro("Erro ao buscar carrinhos"));
    fetch("http://localhost:8080/pedidos/all")
      .then((r) => r.json())
      .then(setPedidos)
      .catch(() => setErro("Erro ao buscar pedidos"));
  }, []);

  // Funções de editar/apagar (apenas exemplo, ajuste conforme backend)
  const handleDelete = async (tipo, id) => {
    let url = "";
    if (tipo === "cliente") url = `http://localhost:8080/clientes/${id}`;
    if (tipo === "carrinho") url = `http://localhost:8080/carrinho/${id}`;
    if (tipo === "pedido") url = `http://localhost:8080/pedidos/${id}`;
    if (!window.confirm("Deseja realmente excluir?")) return;
    await fetch(url, { method: "DELETE" });
    window.location.reload();
  };

  return (
    <div style={{ margin: 30, display: "flex", gap: 32, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 320 }}>
        <h2>Clientes</h2>
        <table className="table table-striped">
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
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.email}</td>
                <td>{c.telefone}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete("cliente", c.id)}
                  >
                    Apagar
                  </button>
                  {/* <button className="btn btn-warning btn-sm ms-2">Editar</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ flex: 1, minWidth: 320 }}>
        <h2>Carrinhos</h2>
        <table className="table table-striped">
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
                <td>{c.id}</td>
                <td>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {(c.itens || []).map((i) => (
                      <li key={i.id}>
                        Pizza {i.pizzaId} - Qtd: {i.quantidade} - R${" "}
                        {Number(i.preco).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete("carrinho", c.id)}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ flex: 1, minWidth: 320 }}>
        <h2>Pedidos</h2>
        <table className="table table-striped">
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
                <td>{p.id}</td>
                <td>{p.cliente?.nome}</td>
                <td>{p.status}</td>
                <td>{p.data?.replace("T", " ")}</td>
                <td>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {(p.itens || []).map((i) => (
                      <li key={i.id}>
                        Pizza {i.pizzaId} - Qtd: {i.quantidade} - R${" "}
                        {Number(i.preco).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete("pedido", p.id)}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}

export default TodosOsItens;
