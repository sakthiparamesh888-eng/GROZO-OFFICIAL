import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useSettings } from '../hooks/useSettings.jsx';
import { rupee, effectivePrice, hasOffer, unitLabel } from '../utils/format.js';
import QuantitySelector from '../components/QuantitySelector.jsx';
import { IconTrash } from '../components/icons.jsx';

export default function Cart() {
  const { items, setQty, removeItem, total } = useCart();
  const { settings } = useSettings();

  if (!items.length) {
    return (
      <div className="container">
        <div className="empty">
          <div className="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some fresh vegetables and fruits to get started.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 14 }}>
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="section-title" style={{ padding: '20px 0 4px' }}>
        Your Cart
      </h1>

      <div className="cart-layout">
        <div>
          {items.map((it) => (
            <div className="cart-item" key={it.key}>
              <Link to={`/product/${it.id}`}>
                <img src={it.image} alt={it.name} loading="lazy" />
              </Link>
              <div>
                <Link to={`/product/${it.id}`} className="ci-name">
                  {it.name}
                  {it.variant && <span className="ci-variant">{it.variant}</span>}
                </Link>
                {it.tamil_name && <div className="ci-tamil">{it.tamil_name}</div>}
                <div className="ci-price">
                  {rupee(effectivePrice(it))}
                  {!it.isVariant && it.unitType ? ` / ${unitLabel(it)}` : ''}
                  {hasOffer(it) && (
                    <span className="price-was" style={{ marginLeft: 6 }}>
                      {rupee(it.price)}
                    </span>
                  )}
                </div>
              </div>
              <div className="cart-item-controls">
                <QuantitySelector
                  value={it.qty}
                  onChange={(q) => setQty(it.key, q)}
                />
                <strong>{rupee(effectivePrice(it) * it.qty)}</strong>
                <button
                  className="link-remove"
                  onClick={() => removeItem(it.key)}
                >
                  <IconTrash style={{ width: 14, height: 14 }} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{rupee(total)}</span>
          </div>
          <div className="summary-row free">
            <span>Delivery</span>
            <span>FREE</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{rupee(total)}</span>
          </div>
          <Link
            to="/checkout"
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: 16 }}
          >
            Proceed to Checkout
          </Link>
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.78rem',
              color: 'var(--ink-soft)',
              marginTop: 10
            }}
          >
            🌿 {settings.delivery_message}
          </p>
          <Link
            to="/"
            className="section-link"
            style={{ display: 'block', textAlign: 'center', marginTop: 10 }}
          >
            ← Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
