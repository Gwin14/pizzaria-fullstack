import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PainelAdmin() {
  const [clientes, setClientes] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [carrinhos, setCarrinhos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/clientes")
      .then((r) => r.json())
      .then(setClientes);
    fetch("http://localhost:8080/pizzas")
      .then((r) => r.json())
      .then(setPizzas);
    fetch("http://localhost:8080/carrinho")
      .then((r) => r.json())
      .then(setCarrinhos);
    fetch("http://localhost:8080/pedidos/all")
      .then((r) => r.json())
      .then(setPedidos);
  }, []);

  const handleDelete = async (tipo, id) => {
    let url = "";
    if (tipo === "cliente") url = `http://localhost:8080/clientes/${id}`;
    if (tipo === "pizza") url = `http://localhost:8080/pizzas/${id}`;
    if (tipo === "carrinho") url = `http://localhost:8080/carrinho/${id}`;
    if (tipo === "pedido") url = `http://localhost:8080/pedidos/${id}`;
    if (!window.confirm("Deseja realmente excluir?")) return;
    await fetch(url, { method: "DELETE" });
    window.location.reload();
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Painel Administrativo</h1>
      <div className="row g-4">
        {/* Clientes */}
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Clientes</span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/novo-cliente")}
              >
                Novo
              </button>
            </div>
            <div className="card-body p-0">
              <table className="table table-striped mb-0">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Pizzas */}
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Pizzas</span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/nova-pizza")}
              >
                Novo
              </button>
            </div>
            <div className="card-body p-0">
              <table className="table table-striped mb-0">
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
                      <td>{p.id}</td>
                      <td>{p.nome}</td>
                      <td>{p.descricao}</td>
                      <td>R$ {Number(p.preco).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete("pizza", p.id)}
                        >
                          Apagar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Carrinhos */}
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Carrinhos</span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/novo-carrinho")}
              >
                Novo
              </button>
            </div>
            <div className="card-body p-0">
              <table className="table table-striped mb-0">
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
                        <ul className="mb-0">
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
          </div>
        </div>
        {/* Pedidos */}
        <div className="col-12 col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Pedidos</span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/novo-pedido")}
              >
                Novo
              </button>
            </div>
            <div className="card-body p-0">
              <table className="table table-striped mb-0">
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
                        <ul className="mb-0">
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
          </div>
        </div>
      </div>
      {erro && <p className="text-danger mt-3">{erro}</p>}
    </div>
  );
}

export default PainelAdmin;
