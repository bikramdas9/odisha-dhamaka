import { useState } from "react";
import { api } from "../lib/api";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      await api.submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to send. Please try again.");
      setStatus("error");
    }
  };

  return (
    <main data-testid="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Questions, feedback, bulk orders — we'd love to hear from you</p>
        </div>
      </div>

      <div className="container contact-grid">
        <section className="contact-form-section">
          {status === "success" ? (
            <div className="contact-success" data-testid="contact-success">
              <span>✅</span>
              <h2>Message sent!</h2>
              <p>We'll get back to you within 24 hours.</p>
              <button className="btn-outline" onClick={() => setStatus("idle")}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} data-testid="contact-form" noValidate>
              <div className="form-group">
                <label htmlFor="c-name">Name *</label>
                <input
                  id="c-name"
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your name"
                  data-testid="contact-name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="c-email">Email *</label>
                <input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="your@email.com"
                  data-testid="contact-email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="c-message">Message *</label>
                <textarea
                  id="c-message"
                  value={form.message}
                  onChange={set("message")}
                  rows={5}
                  placeholder="How can we help?"
                  data-testid="contact-message"
                />
              </div>
              {error && <p className="form-error" data-testid="contact-error">{error}</p>}
              <button
                type="submit"
                className="btn-primary"
                disabled={status === "submitting"}
                data-testid="contact-submit"
              >
                {status === "submitting" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </section>

        <aside className="contact-info">
          <div className="info-card">
            <h3>Reach us directly</h3>
            <div className="info-item" data-testid="contact-phone">
              <span>📞</span>
              <div>
                <strong>Phone / WhatsApp</strong>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="info-item">
              <span>📧</span>
              <div>
                <strong>Email</strong>
                <p>hello@odishadhamaka.in</p>
              </div>
            </div>
            <div className="info-item">
              <span>📍</span>
              <div>
                <strong>Kitchen Location</strong>
                <p>Patia, Bhubaneswar, Odisha 751024</p>
              </div>
            </div>
            <div className="info-item">
              <span>🕐</span>
              <div>
                <strong>Hours</strong>
                <p>Mon–Sun · 10:00 AM – 9:00 PM</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
