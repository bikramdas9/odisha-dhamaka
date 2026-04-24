import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import "./Navbar.css";

export default function Navbar() {
  const { count, isOpen, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar" data-testid="navbar">
        <div className="container nav-inner">
          <Link to="/" className="brand" data-testid="brand-logo">
            <span className="brand-icon">🍛</span>
            <span className="brand-text">Odisha Dhamaka</span>
          </Link>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`} data-testid="nav-links">
            <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
            <li><NavLink to="/menu" onClick={() => setMenuOpen(false)}>Menu</NavLink></li>
            <li><NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink></li>
            <li><NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
            <li><NavLink to="/whatsapp-order" onClick={() => setMenuOpen(false)} className="wa-nav-link">💬 WhatsApp</NavLink></li>
            <li><NavLink to="/admin/orders" onClick={() => setMenuOpen(false)}>Admin</NavLink></li>
          </ul>

          <div className="nav-actions">
            <button
              className="cart-btn"
              onClick={() => setIsOpen(true)}
              data-testid="cart-btn"
              aria-label="Open cart"
            >
              🛒
              {count > 0 && (
                <span className="cart-badge" data-testid="cart-count">{count}</span>
              )}
            </button>
            <button
              className="hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              data-testid="hamburger"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
