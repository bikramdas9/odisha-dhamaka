import { useEffect, useState } from "react";
import { api } from "../lib/api";
import "./AdminOrders.css";

const STATUSES = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending: "#F0C040",
  confirmed: "#5B8CFF",
  preparing: "#E8650A",
  out_for_delivery: "#9B59B6",
  delivered: "#1A6B3A",
  cancelled: "#C0392B",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.listOrders()
      .then(setOrders)
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      setError("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <main className="admin-page" data-testid="admin-orders-page">
      <div className="admin-header">
        <div className="container">
          <h1>Admin — Orders</h1>
          <button className="btn-outline refresh-btn" onClick={load} data-testid="refresh-orders">
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="container admin-body">
        {error && <p className="admin-error">{error}</p>}

        {loading ? (
          <div className="loading-rows">
            {[...Array(5)].map((_, i) => <div key={i} className="row-skeleton" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders" data-testid="no-orders">
            <span>📋</span>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="orders-table-wrap">
            <table className="orders-table" data-testid="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id} data-testid={`order-row-${order.order_id}`}>
                    <td className="oid-cell" data-testid={`oid-${order.order_id}`}>
                      {order.order_id}
                    </td>
                    <td>{order.customer_name}</td>
                    <td>{order.phone}</td>
                    <td>
                      <ul className="items-mini">
                        {order.items.map((item, i) => (
                          <li key={i}>
                            {item.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="price-cell">₹{order.total}</td>
                    <td>{order.payment_method}</td>
                    <td className="time-cell">
                      {new Date(order.created_at).toLocaleString("en-IN", {
                        day: "2-digit", month: "short",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                        disabled={updating === order.order_id}
                        data-testid={`status-select-${order.order_id}`}
                        style={{ "--status-color": STATUS_COLORS[order.status] || "#666" }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
