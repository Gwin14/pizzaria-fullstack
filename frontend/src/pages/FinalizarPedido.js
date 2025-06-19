import React, { useState } from "react";

function FinalizarPedido({ clienteId, carrinhoId, onPedidoFinalizado }) {
  const [mensagem, setMensagem] = useState("");
  const [pedido, setPedido] = useState(null);

  const finalizar = async () => {
    setMensagem("");
    try {
      const resp = await fetch(
        `http://localhost:8080/pedidos?clienteId=${clienteId}&carrinhoId=${carrinhoId}`,
        { method: "POST" }
      );
      if (!resp.ok) throw new Error("Erro ao finalizar pedido");
      const data = await resp.json();
      setPedido(data);
      setMensagem("Pedido realizado com sucesso! Status: " + data.status);
      if (onPedidoFinalizado) onPedidoFinalizado(data);
    } catch (err) {
      setMensagem("Erro: " + err.message);
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <button onClick={finalizar}>Finalizar Pedido</button>
      {mensagem && <p>{mensagem}</p>}
      {pedido && (
        <div>
          <h3>Resumo do Pedido</h3>
          <p>ID: {pedido.id}</p>
          <p>Status: {pedido.status}</p>
          <p>Data: {pedido.data?.replace("T", " ")}</p>
          <ul>
            {pedido.itens?.map((item) => (
              <li key={item.id}>
                Pizza {item.pizzaId} - Qtd: {item.quantidade} - R${" "}
                {item.preco.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FinalizarPedido;
