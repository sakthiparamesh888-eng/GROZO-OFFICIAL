export default function TrustSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="trust fade-up">
          <span className="section-eyebrow" style={{ color: 'var(--green-100)' }}>
            🌿 Fresh From Farmer
          </span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)' }}>
            Real produce. Real photos. Real prices.
          </h2>
          <p style={{ maxWidth: 620, margin: '12px auto 0', opacity: 0.92 }}>
            We upload real photos of today’s vegetables and fruits — no fake
            Google images, no unnecessary packing costs, and no delivery
            charges. Just farm-fresh food at prices lower than the grocery apps.
          </p>
          <div className="trust-stats">
            <div className="trust-stat">
              <div className="num">100%</div>
              <div className="lbl">Real Photos</div>
            </div>
            <div className="trust-stat">
              <div className="num">₹0</div>
              <div className="lbl">Delivery Charge</div>
            </div>
            <div className="trust-stat">
              <div className="num">Daily</div>
              <div className="lbl">Fresh Harvest</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
