import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartDrawer.css";

export default function CartDrawer({ isOpen, onClose }) {
  const { items, total, remove, updateQty } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        data-testid="cart-overlay"
      />
      <aside className={`cart-drawer ${isOpen ? "open" : ""}`} data-testid="cart-drawer">
        <div className="drawer-header">
          <h3>Your Cart</h3>
          <button className="close-btn" onClick={onClose} data-testid="close-cart">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty" data-testid="cart-empty">
            <span>🍽️</span>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <ul className="cart-items" data-testid="cart-items">
              {items.map((item) => (
                <li key={item.id} className="cart-item" data-testid={`cart-item-${item.id}`}>
                  <div className="item-info">
                    <span className={item.veg ? "veg-badge" : "nonveg-badge"} />
                    <span className="item-name">{item.name}</span>
                  </div>
                  <div className="item-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      data-testid={`qty-dec-${item.id}`}
                    >−</button>
                    <span className="qty-val" data-testid={`qty-${item.id}`}>{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      data-testid={`qty-inc-${item.id}`}
                    >+</button>
                  </div>
                  <span className="item-price">₹{item.price * item.qty}</span>
                  <button
                    className="remove-btn"
                    onClick={() => remove(item.id)}
                    data-testid={`remove-${item.id}`}
                  >🗑</button>
                </li>
              ))}
            </ul>

            <div className="drawer-footer">
              <div className="total-row">
                <span>Total</span>
                <span data-testid="cart-total">₹{total}</span>
              </div>
              <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={handleCheckout}
                data-testid="checkout-btn"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
