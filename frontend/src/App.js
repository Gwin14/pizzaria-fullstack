import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import ViewUser from "./users/ViewUser";
import ClienteCadastro from "./pages/ClienteCadastro";
import Carrinho from "./pages/Carrinho";
import FinalizarPedido from "./pages/FinalizarPedido";
import HistoricoPedidos from "./pages/HistoricoPedidos";
import TodosOsItens from "./pages/TodosOsItens";
import CrudPizzas from "./pages/CrudPizzas";
import React from "react";
import PainelAdmin from "./pages/PainelAdmin";

function App() {
  // Exemplo: clienteId e carrinhoId fixos para teste
  const [clienteId] = React.useState(localStorage.getItem("clienteId") || 1);
  const [carrinhoId] = React.useState(1);
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<PainelAdmin />} />
          <Route exact path="/novo-cliente" element={<ClienteCadastro />} />
          <Route
            exact
            path="/nova-pizza"
            element={<CrudPizzas modoCriacao={true} />}
          />
          {/* Adicione rotas para criação de carrinho e pedido se desejar */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
