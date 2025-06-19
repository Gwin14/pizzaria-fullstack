import React, { useEffect, useState } from "react";

function HistoricoPedidos({ clienteId }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (clienteId) {
      fetch(`http://localhost:8080/pedidos?clienteId=${clienteId}`)
        .then((r) => r.json())
        .then(setPedidos)
        .catch(() => setPedidos([]));
    }
  }, [clienteId]);

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Histórico de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <table border="1" cellPadding={5} style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Status</th>
              <th>Itens</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.data?.replace("T", " ")}</td>
                <td>{pedido.status}</td>
                <td>
                  <ul>
                    {pedido.itens?.map((item) => (
                      <li key={item.id}>
                        Pizza {item.pizzaId} - Qtd: {item.quantidade} - R${" "}
                        {item.preco.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HistoricoPedidos;
