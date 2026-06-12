import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useSettings } from '../hooks/useSettings.js';
import { saveOrder } from '../services/api.js';
import { rupee, effectivePrice, unitLabel } from '../utils/format.js';
import { buildOrderMessage, whatsappLink } from '../utils/whatsapp.js';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverNote, setServerNote] = useState('');

  if (!items.length) {
    return (
      <div className="container">
        <div className="empty">
          <div className="icon">🧺</div>
          <h3>Nothing to check out</h3>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 14 }}>
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your name.';
    const digits = form.phone.replace(/[^0-9]/g, '');
    if (digits.length < 10) errs.phone = 'Enter a valid 10-digit phone number.';
    if (!form.address.trim()) errs.address = 'Please enter your delivery address.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setServerNote('');

    const orderId = 'GRZ' + Date.now().toString().slice(-8);

    // Structured line items with full variant detail (stored as JSON in the
    // Orders sheet so nothing about the purchase is lost).
    const orderItems = items.map((it) => ({
      name: it.name,
      variant: it.variant || unitLabel(it) || '',
      price: effectivePrice(it),
      qty: it.qty,
      amount: effectivePrice(it) * it.qty
    }));

    const order = {
      order_id: orderId,
      date: new Date().toISOString(),
      customer_name: form.name.trim(),
      phone: form.phone.trim(),
      address: `${form.address.trim()}${form.landmark ? ', Landmark: ' + form.landmark.trim() : ''}`,
      items: JSON.stringify(orderItems),
      total,
      status: 'NEW',
      notes: form.notes.trim()
    };

    // 1) Save to Google Sheets (best-effort — never block the order).
    try {
      await saveOrder(order);
    } catch (err) {
      setServerNote(
        'We couldn’t auto-save the order, but your WhatsApp message will still go through.'
      );
    }

    // 2) Build & open WhatsApp message.
    const message = buildOrderMessage({
      orderId,
      customer: form,
      items,
      total,
      settings
    });
    const link = whatsappLink(settings.whatsapp, message);

    // 3) Clear cart and hand off to WhatsApp.
    clearCart();
    setSubmitting(false);
    window.location.href = link;
    // Fallback in case the redirect is blocked.
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="container">
      <h1 className="section-title" style={{ padding: '20px 0 4px' }}>
        Checkout
      </h1>

      <div className="checkout-layout">
        <div className="form-card">
          <div className="field">
            <label>
              Full name <span className="req">*</span>
            </label>
            <input
              value={form.name}
              onChange={update('name')}
              placeholder="e.g. Sakthi"
              className={errors.name ? 'invalid' : ''}
              autoComplete="name"
            />
            {errors.name && <div className="err">{errors.name}</div>}
          </div>

          <div className="field">
            <label>
              Phone number <span className="req">*</span>
            </label>
            <input
              value={form.phone}
              onChange={update('phone')}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              className={errors.phone ? 'invalid' : ''}
              autoComplete="tel"
            />
            {errors.phone && <div className="err">{errors.phone}</div>}
          </div>

          <div className="field">
            <label>
              Delivery address <span className="req">*</span>
            </label>
            <textarea
              rows="3"
              value={form.address}
              onChange={update('address')}
              placeholder="House no, street, area, city, pincode"
              className={errors.address ? 'invalid' : ''}
            />
            {errors.address && <div className="err">{errors.address}</div>}
          </div>

          <div className="field">
            <label>Landmark</label>
            <input
              value={form.landmark}
              onChange={update('landmark')}
              placeholder="Nearby shop, temple, signal…"
            />
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea
              rows="2"
              value={form.notes}
              onChange={update('notes')}
              placeholder="Any special instructions?"
            />
          </div>

          {serverNote && <div className="notice">{serverNote}</div>}
        </div>

        <aside className="summary">
          <h3>Your Order</h3>
          {items.map((it) => (
            <div className="summary-row" key={it.key}>
              <span>
                {it.name}
                {it.variant ? ` (${it.variant})` : ''} × {it.qty}
              </span>
              <span>{rupee(effectivePrice(it) * it.qty)}</span>
            </div>
          ))}
          <div className="summary-row free">
            <span>Delivery</span>
            <span>FREE</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{rupee(total)}</span>
          </div>

          <button
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: 16 }}
            onClick={placeOrder}
            disabled={submitting}
          >
            {submitting ? 'Placing order…' : 'Place Order on WhatsApp'}
          </button>
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.76rem',
              color: 'var(--ink-soft)',
              marginTop: 10
            }}
          >
            No online payment. We confirm your order on WhatsApp and you pay on
            delivery.
          </p>
        </aside>
      </div>
    </div>
  );
}
