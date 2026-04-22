import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" data-testid="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🍛</span>
          <span className="footer-name">Odisha Dhamaka</span>
          <p>Authentic Odia cloud kitchen, Patia, Bhubaneswar</p>
        </div>

        <nav className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin/orders">Admin</Link>
        </nav>

        <div className="footer-contact">
          <p>📞 +91 98765 43210</p>
          <p>📧 hello@odishadhamaka.in</p>
          <p>🕐 Mon–Sun · 10 AM – 9 PM</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Odisha Dhamaka. Made with ❤️ in Odisha.</p>
      </div>
    </footer>
  );
}
