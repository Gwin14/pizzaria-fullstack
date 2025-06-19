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

function App() {
  // Exemplo: clienteId e carrinhoId fixos para teste
  const [clienteId] = React.useState(localStorage.getItem("clienteId") || 1);
  const [carrinhoId] = React.useState(1);
  return (
    <div className="App">
      <CrudPizzas />
      <TodosOsItens />
      {/* <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/adduser" element={<AddUser />} />
          <Route exact path="/edituser/:id" element={<EditUser />} />
          <Route exact path="/viewuser/:id" element={<ViewUser />} />
        </Routes>
      </Router> */}
      <ClienteCadastro />
      <Carrinho carrinhoId={carrinhoId} />
      <FinalizarPedido clienteId={clienteId} carrinhoId={carrinhoId} />
      <HistoricoPedidos clienteId={clienteId} />
    </div>
  );
}

export default App;
