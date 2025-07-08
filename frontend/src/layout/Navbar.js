import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [clienteNome, setClienteNome] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");

  useEffect(() => {
    setClienteNome(localStorage.getItem("clienteNome") || "");
    setClienteEmail(localStorage.getItem("clienteEmail") || "");
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("clienteId");
    localStorage.removeItem("clienteNome");
    localStorage.removeItem("clienteEmail");
    setClienteNome("");
    setClienteEmail("");
    navigate("/login-cliente");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">SANTA PIZZA</div>
      <div className="nav-links">
        <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>Home</Link>
        <Link to="/pizzas" className={isActive('/pizzas') ? 'nav-link active' : 'nav-link'}>Cardápio</Link>
        <Link to="/carrinho" className={isActive('/carrinho') ? 'nav-link active' : 'nav-link'}>Carrinho</Link>
        <Link to="/pedidos" className={isActive('/pedidos') ? 'nav-link active' : 'nav-link'}>Meus Pedidos</Link>
        {clienteEmail === "admin@email.com" && (
          <Link to="/admin" className={isActive('/admin') ? 'nav-link active' : 'nav-link'}>Admin</Link>
        )}
        {clienteNome ? (
          <>
            <span className="nav-link" style={{ fontWeight: 600 }}>
              Olá, {clienteNome.split(" ")[0]}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login-cliente" className="nav-link">Entrar</Link>
            <Link to="/cadastro-cliente" className="nav-link">Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}
