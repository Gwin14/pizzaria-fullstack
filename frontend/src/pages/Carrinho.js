import React, { useEffect, useState } from "react";

function Carrinho({ carrinhoId }) {
  const [itens, setItens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [pizzaId, setPizzaId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [preco, setPreco] = useState(0);

  // Busca itens do carrinho
  useEffect(() => {
    if (carrinhoId) {
      fetch(`http://localhost:8080/carrinho/${carrinhoId}`)
        .then((r) => r.json())
        .then(setItens)
        .catch(() => setItens([]));
    }
  }, [carrinhoId]);

  // Adiciona pizza ao carrinho
  const adicionarItem = async (e) => {
    e.preventDefault();
    setMensagem("");
    try {
      const resp = await fetch("http://localhost:8080/carrinho", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pizzaId: Number(pizzaId),
          quantidade: Number(quantidade),
          preco: Number(preco),
          carrinho: { id: carrinhoId },
        }),
      });
      if (!resp.ok) throw new Error("Erro ao adicionar item");
      setMensagem("Item adicionado!");
      setPizzaId("");
      setQuantidade(1);
      setPreco(0);
      // Atualiza lista
      fetch(`http://localhost:8080/carrinho/${carrinhoId}`)
        .then((r) => r.json())
        .then(setItens);
    } catch (err) {
      setMensagem("Erro: " + err.message);
    }
  };

  // Remove item
  const removerItem = async (itemId) => {
    await fetch(`http://localhost:8080/carrinho/${itemId}`, {
      method: "DELETE",
    });
    setItens(itens.filter((i) => i.id !== itemId));
  };

  // Atualiza quantidade
  const atualizarQuantidade = async (item) => {
    await fetch("http://localhost:8080/carrinho", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    // Atualiza lista
    fetch(`http://localhost:8080/carrinho/${carrinhoId}`)
      .then((r) => r.json())
      .then(setItens);
  };

  const total = itens.reduce(
    (sum, i) => Number(i.preco || 0) * Number(i.quantidade || 0) + sum,
    0
  );

  return (
    <div>
      <h2>Carrinho de Compras</h2>
      <form onSubmit={adicionarItem} style={{ marginBottom: 20 }}>
        <input
          placeholder="ID da Pizza"
          value={pizzaId}
          onChange={(e) => setPizzaId(e.target.value)}
          required
        />
        <input
          type="number"
          min={1}
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />
        <input
          type="number"
          min={0}
          step={0.01}
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
        <button type="submit">Adicionar Pizza</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
      <table border="1" cellPadding={5} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Pizza</th>
            <th>Qtd</th>
            <th>Preço</th>
            <th>Subtotal</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.id || Math.random()}>
              <td>{item.id}</td>
              <td>{item.pizzaId}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={item.quantidade}
                  onChange={(e) =>
                    atualizarQuantidade({
                      ...item,
                      quantidade: Number(e.target.value),
                    })
                  }
                  style={{ width: 50 }}
                />
              </td>
              <td>R$ {Number(item.preco || 0).toFixed(2)}</td>
              <td>
                R${" "}
                {(
                  Number(item.preco || 0) * Number(item.quantidade || 0)
                ).toFixed(2)}
              </td>
              <td>
                <button onClick={() => removerItem(item.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total: R$ {total.toFixed(2)}</h3>
    </div>
  );
}

export default Carrinho;
