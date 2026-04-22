import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getOrder(orderId)
      .then(setOrder)
      .catch(() => setError("Could not load order details."));
  }, [orderId]);

  return (
    <main className="success-page" data-testid="order-success-page">
      <div className="container success-inner">
        <div className="success-icon" aria-hidden="true">🎉</div>
        <h1>Order Placed!</h1>
        <p className="success-sub">
          Thank you for your order. We're preparing your food now!
        </p>

        <div className="order-id-card" data-testid="order-id-card">
          <span className="oid-label">Order ID</span>
          <span className="oid-value" data-testid="order-id">{orderId}</span>
        </div>

        {error && <p className="error-note">{error}</p>}

        {order && (
          <div className="order-detail-card" data-testid="order-detail-card">
            <div className="detail-row">
              <span>Name</span>
              <span data-testid="success-customer-name">{order.customer_name}</span>
            </div>
            <div className="detail-row">
              <span>Phone</span>
              <span>{order.phone}</span>
            </div>
            <div className="detail-row">
              <span>Payment</span>
              <span>{order.payment_method === "cod" ? "Cash on Delivery" : "UPI on Delivery"}</span>
            </div>
            <div className="detail-row">
              <span>Total</span>
              <span data-testid="success-total">₹{order.total}</span>
            </div>
            <div className="detail-row">
              <span>Status</span>
              <span className="status-pill" data-testid="success-status">{order.status}</span>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link to="/menu" className="btn-primary">Order More</Link>
          <Link to="/" className="btn-outline">Back to Home</Link>
        </div>

        <p className="eta-note">🛵 Expected delivery: <strong>30–45 minutes</strong></p>
      </div>
    </main>
  );
}
