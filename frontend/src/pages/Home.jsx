import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import MenuCard from "../components/MenuCard";
import "./Home.css";

const CATEGORIES = [
  { key: "rice", label: "Rice & Pakhala", emoji: "🍚" },
  { key: "curry", label: "Curries & Gravies", emoji: "🍲" },
  { key: "snacks", label: "Street Snacks", emoji: "🫙" },
  { key: "sweets", label: "Sweets & Mithai", emoji: "🍮" },
  { key: "thali", label: "Thali Meals", emoji: "🥘" },
];

const TESTIMONIALS = [
  {
    name: "Supriya Mishra",
    city: "Bhubaneswar",
    text: "The Pakhala Bhata transported me back to my childhood! Exactly how my mother makes it. Can't believe I can order this in 2024.",
    rating: 5,
  },
  {
    name: "Rajan Mohanty",
    city: "Bangalore (Ex-Odia)",
    text: "Chhena Poda here is the real deal — baked with that signature caramelised crust. Every expat Odia needs this.",
    rating: 5,
  },
  {
    name: "Priyanka Das",
    city: "Cuttack",
    text: "Dahi Bara Aloo Dum for breakfast on a Sunday morning = peak happiness. Fast delivery, hot food, reasonable prices.",
    rating: 5,
  },
];

export default function Home() {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBestsellers()
      .then(setBestsellers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main data-testid="home-page">
      {/* Hero */}
      <section className="hero" data-testid="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <p className="hero-eyebrow">🌶️ Cloud Kitchen · Authentic Odisha</p>
            <h1 className="hero-title">
              Tastes straight from<br />
              <em>Maa's kitchen</em>
            </h1>
            <p className="hero-subtitle">
              16 authentic Odia dishes — Dalma, Macha Besara, Chhena Poda, Rasabali and more.
              Slow-cooked, home-style, delivered hot.
            </p>
            <div className="hero-actions">
              <Link to="/menu" className="btn-primary" data-testid="hero-order-btn">
                Order Now
              </Link>
              <Link to="/about" className="btn-outline">Our Story</Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="dish-float dish-1">🍲</div>
            <div className="dish-float dish-2">🐟</div>
            <div className="dish-float dish-3">🧀</div>
            <div className="dish-float dish-4">🍚</div>
          </div>
        </div>
      </section>

      {/* Bento Categories */}
      <section className="categories-section" data-testid="categories-section">
        <div className="container">
          <h2 className="section-title">Explore by Category</h2>
          <div className="bento-grid" data-testid="bento-grid">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                to={`/menu?cat=${c.key}`}
                className="bento-card"
                data-testid={`category-${c.key}`}
              >
                <span className="bento-emoji">{c.emoji}</span>
                <span className="bento-label">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bestsellers-section" data-testid="bestsellers-section">
        <div className="container">
          <h2 className="section-title">Bestsellers</h2>
          <p className="section-sub">Our most-loved dishes — ordered again and again</p>
          {loading ? (
            <div className="loading-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-skeleton" />
              ))}
            </div>
          ) : (
            <div className="menu-grid" data-testid="bestsellers-grid">
              {bestsellers.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
          <div className="section-cta">
            <Link to="/menu" className="btn-outline" data-testid="view-full-menu-btn">
              View Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="story-section" data-testid="story-section">
        <div className="container story-inner">
          <div className="story-visual" aria-hidden="true">
            <div className="story-emoji-bg">🍛</div>
          </div>
          <div className="story-text">
            <p className="hero-eyebrow">Our Story</p>
            <h2>Born from homesickness,<br />built with love</h2>
            <p>
              Odisha Dhamaka started when our founder Priya couldn't find real Odia food
              anywhere in the city. Not the tourist-trap approximation — the actual thing.
              Fermented Pakhala. Proper Macha Besara with yellow mustard and raw mango.
              Chhena Poda baked until caramelised.
            </p>
            <p>
              So she started cooking it herself, sharing with neighbours, and then — one
              viral Instagram story later — she was getting 50 orders a week from Odia
              expats across the city. That was 2023. Now we're a full cloud kitchen,
              still cooking every dish fresh, still following traditional Odia recipes.
            </p>
            <Link to="/about" className="btn-outline" style={{ marginTop: "8px" }}>Read More</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" data-testid="testimonials-section">
        <div className="container">
          <h2 className="section-title">What our customers say</h2>
          <div className="testimonials-grid" data-testid="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card" data-testid={`testimonial-${i}`}>
                <div className="stars">{"★".repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <strong>{t.name}</strong>
                  <span>{t.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
