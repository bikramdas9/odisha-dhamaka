import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";
import "./Checkout.css";

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery", icon: "💵" },
  { value: "upi_on_delivery", label: "UPI on Delivery", icon: "📱" },
];

export default function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", payment_method: "cod" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    navigate("/menu");
    return null;
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const payload = {
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        payment_method: form.payment_method,
        items: items.map((i) => ({
          menu_item_id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.qty,
          veg: i.veg,
        })),
        total,
      };
      const order = await api.createOrder(payload);
      clear();
      navigate(`/order-success/${order.order_id}`);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page" data-testid="checkout-page">
      <div className="container checkout-grid">
        {/* Form */}
        <section className="checkout-form-section">
          <h1>Checkout</h1>
          <form onSubmit={handleSubmit} data-testid="checkout-form" noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Rabi Panda"
                required
                data-testid="input-name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="10-digit mobile number"
                required
                data-testid="input-phone"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Delivery Address *</label>
              <textarea
                id="address"
                value={form.address}
                onChange={set("address")}
                rows={3}
                placeholder="House no, street, area, city…"
                required
                data-testid="input-address"
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods" data-testid="payment-methods">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.value}
                    className={`payment-option ${form.payment_method === m.value ? "selected" : ""}`}
                    data-testid={`payment-${m.value}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.value}
                      checked={form.payment_method === m.value}
                      onChange={set("payment_method")}
                    />
                    <span className="p-icon">{m.icon}</span>
                    <span className="p-label">{m.label}</span>
                    <span className="p-mock">(MOCKED — no real charge)</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="form-error" data-testid="checkout-error">{error}</p>}

            <button
              type="submit"
              className="btn-primary place-order-btn"
              disabled={loading}
              data-testid="place-order-btn"
            >
              {loading ? "Placing order…" : `Place Order · ₹${total}`}
            </button>
          </form>
        </section>

        {/* Order summary */}
        <aside className="order-summary" data-testid="order-summary">
          <h2>Order Summary</h2>
          <ul className="summary-items">
            {items.map((item) => (
              <li key={item.id} className="summary-item" data-testid={`summary-item-${item.id}`}>
                <span className={item.veg ? "veg-badge" : "nonveg-badge"} />
                <span className="summary-name">{item.name} × {item.qty}</span>
                <span className="summary-price">₹{item.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Total</span>
            <span data-testid="summary-total">₹{total}</span>
          </div>
          <p className="delivery-note">🛵 Free delivery · 30–45 min</p>
        </aside>
      </div>
    </main>
  );
}
