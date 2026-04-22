import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <main data-testid="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>Our Story</h1>
        </div>
      </div>

      <div className="container about-body">
        <section className="about-section">
          <h2>Born from homesickness</h2>
          <p>
            Odisha has one of India's most underrated cuisines. While Punjabi, South Indian and
            Bengali food has found its way into every city's restaurant landscape, traditional Odia
            cooking — the real thing, not the approximation — remains largely unknown outside the state.
          </p>
          <p>
            Priya Mishra moved to Bhubaneswar from her village in Puri district in 2021. She missed her
            mother's Pakhala Bhata on summer mornings. She missed the Macha Besara cooked with yellow
            mustard seeds pounded in a silbatta. She missed Chhena Poda baked in a coal oven until
            the outside caramelised deep brown.
          </p>
          <p>
            She started cooking these dishes for herself, then for neighbours, then for friends of
            friends. In March 2023, an Instagram reel of her Pakhala setup went viral in Odia expat
            groups across Bangalore, Pune and Hyderabad. The orders — WhatsApp messages, really —
            started flooding in. Odisha Dhamaka was born.
          </p>
        </section>

        <section className="about-section">
          <h2>How we cook</h2>
          <p>
            Everything is made fresh to order. We use mustard oil from Kendrapara, raw mango and
            green mangoes sourced seasonally, and panch phoron (the five-spice blend of fenugreek,
            nigella, cumin, black mustard and fennel seeds) that underpins so much of Odia cooking.
          </p>
          <p>
            We don't use MSG or artificial colours. We don't compromise on fermentation time for
            Pakhala. We won't serve you Chhena Poda that hasn't been baked long enough to develop
            that caramelised crust.
          </p>
        </section>

        <section className="about-values">
          <div className="value-card" data-testid="value-authentic">
            <span>🫙</span>
            <h3>Authentic</h3>
            <p>Traditional recipes, no shortcuts</p>
          </div>
          <div className="value-card" data-testid="value-fresh">
            <span>🌿</span>
            <h3>Fresh Daily</h3>
            <p>Cooked fresh for every order</p>
          </div>
          <div className="value-card" data-testid="value-delivery">
            <span>🛵</span>
            <h3>Fast Delivery</h3>
            <p>30–45 minutes to your door</p>
          </div>
        </section>

        <div className="about-cta">
          <Link to="/menu" className="btn-primary">Explore the Menu</Link>
          <Link to="/contact" className="btn-outline">Get in Touch</Link>
        </div>
      </div>
    </main>
  );
}
