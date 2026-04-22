import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import MenuCard from "../components/MenuCard";
import "./Menu.css";

const CATEGORIES = ["all", "rice", "curry", "snacks", "sweets", "thali"];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCat, setActiveCat] = useState(searchParams.get("cat") || "all");
  const tabsRef = useRef(null);

  useEffect(() => {
    api.getMenu()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCat = (cat) => {
    setActiveCat(cat);
    setSearchParams(cat === "all" ? {} : { cat });
  };

  const filtered = items.filter((item) => {
    const matchesCat = activeCat === "all" || item.category === activeCat;
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main data-testid="menu-page">
      <div className="menu-hero">
        <div className="container">
          <h1>Our Menu</h1>
          <p>16 authentic Odia dishes, cooked fresh every day</p>
          <input
            className="search-input"
            type="search"
            placeholder="Search dishes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="menu-search"
            aria-label="Search menu"
          />
        </div>
      </div>

      <div className="sticky-tabs" ref={tabsRef} data-testid="category-tabs">
        <div className="container tabs-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeCat === cat ? "active" : ""}`}
              onClick={() => handleCat(cat)}
              data-testid={`tab-${cat}`}
            >
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <section className="menu-section">
        <div className="container">
          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="card-skeleton" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-results" data-testid="no-results">
              <span>🔍</span>
              <p>No dishes found</p>
            </div>
          ) : (
            <div className="menu-grid" data-testid="menu-grid">
              {filtered.map((item) => <MenuCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
