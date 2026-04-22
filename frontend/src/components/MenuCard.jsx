import { useCart } from "../context/CartContext";
import "./MenuCard.css";

export default function MenuCard({ item }) {
  const { add } = useCart();

  return (
    <div className="menu-card" data-testid={`menu-card-${item.id}`}>
      <div className="card-emoji" role="img" aria-label={item.name}>{item.emoji}</div>
      <div className="card-body">
        <div className="card-meta">
          <span className={item.veg ? "veg-badge" : "nonveg-badge"} />
          <span className="card-category">{item.category}</span>
          {item.bestseller && (
            <span className="bestseller-tag" data-testid={`bestseller-${item.id}`}>⭐ Bestseller</span>
          )}
        </div>
        <h3 className="card-name" data-testid={`item-name-${item.id}`}>{item.name}</h3>
        <p className="card-desc">{item.desc}</p>
        <div className="card-footer">
          <span className="card-price" data-testid={`item-price-${item.id}`}>₹{item.price}</span>
          <button
            className="add-btn"
            onClick={() => add({ id: item.id, name: item.name, price: item.price, veg: item.veg })}
            data-testid={`add-to-cart-${item.id}`}
            aria-label={`Add ${item.name} to cart`}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
