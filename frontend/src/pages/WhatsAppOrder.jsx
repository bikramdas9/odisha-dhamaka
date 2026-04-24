import "./WhatsAppOrder.css";

const API = import.meta.env.VITE_API_URL || "/api";

export default function WhatsAppOrder() {
  const qrUrl = `${API}/qr/whatsapp`;

  return (
    <main className="wa-page" data-testid="whatsapp-order-page">
      <div className="container wa-inner">
        {/* Left — instructions */}
        <section className="wa-instructions">
          <p className="wa-eyebrow">📱 Order on WhatsApp</p>
          <h1>Scan & Order<br />in seconds</h1>
          <p className="wa-sub">
            No app download. No account needed. Just scan, chat, and get
            authentic Odia food delivered to your door.
          </p>

          <ol className="wa-steps">
            <li>
              <span className="step-num">1</span>
              <div>
                <strong>Scan the QR code</strong>
                <p>Opens WhatsApp on your phone automatically</p>
              </div>
            </li>
            <li>
              <span className="step-num">2</span>
              <div>
                <strong>Browse the menu</strong>
                <p>Our bot sends you the full menu with prices</p>
              </div>
            </li>
            <li>
              <span className="step-num">3</span>
              <div>
                <strong>Pick your dishes</strong>
                <p>Reply with item numbers — e.g. <em>1, 3, 6</em></p>
              </div>
            </li>
            <li>
              <span className="step-num">4</span>
              <div>
                <strong>Confirm your order</strong>
                <p>Share name, address, payment — done!</p>
              </div>
            </li>
          </ol>

          <div className="wa-badges">
            <span>🟢 Veg options clearly marked</span>
            <span>🔴 Non-veg clearly marked</span>
            <span>🛵 30–45 min delivery</span>
            <span>💵 COD & UPI on Delivery</span>
          </div>
        </section>

        {/* Right — QR code */}
        <section className="wa-qr-section">
          <div className="qr-card" data-testid="qr-card">
            <div className="qr-header">
              <span>💬</span>
              <span>WhatsApp Order</span>
            </div>
            <img
              src={qrUrl}
              alt="Scan to order on WhatsApp"
              className="qr-image"
              data-testid="qr-image"
            />
            <p className="qr-hint">Scan with your phone camera</p>
            <div className="qr-divider">or</div>
            <a
              href="https://wa.me/14155238886?text=menu"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary wa-chat-btn"
              data-testid="open-whatsapp-btn"
            >
              💬 Open WhatsApp Chat
            </a>
            <p className="qr-note">
              Works with WhatsApp on any phone
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
