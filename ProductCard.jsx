import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  rupee,
  effectivePrice,
  hasOffer,
  discountPercent,
  inStock,
  unitLabel,
  parseVariants,
  productHasVariants,
  variantEffectivePrice,
  variantHasOffer
} from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';
import { IconCheck } from './icons.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const available = inStock(product);

  const hasVariants = productHasVariants(product);
  const variants = hasVariants ? parseVariants(product) : [];
  const [vIndex, setVIndex] = useState(0);
  const variant = hasVariants ? variants[vIndex] : null;

  // Price shown on the card reflects the currently selected option.
  const shownPrice = variant ? variantEffectivePrice(variant) : effectivePrice(product);
  const shownStruck = variant
    ? variantHasOffer(variant)
      ? variant.price
      : null
    : hasOffer(product)
    ? product.price
    : null;

  const onAdd = (e) => {
    e.preventDefault();
    if (!available) return;
    addItem(product, 1, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Keep clicks on the dropdown from following the card link.
  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link to={`/product/${product.id}`} className="card fade-up">
      <div className="card-media">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%23e8f5e9"/><text x="50%" y="50%" font-size="60" text-anchor="middle" dy=".35em">🥬</text></svg>'
              );
          }}
        />
        {!variant && hasOffer(product) && (
          <span className="badge badge-offer">{discountPercent(product)}% OFF</span>
        )}
        {variant && variantHasOffer(variant) && (
          <span className="badge badge-offer">OFFER</span>
        )}
        {product.origin && (
          <span className="badge badge-origin">📍 {product.origin}</span>
        )}
        {!available && <span className="badge-out">Out of Stock</span>}
      </div>

      <div className="card-body">
        <span className="card-name">{product.name}</span>
        {product.tamil_name && (
          <span className="card-tamil">{product.tamil_name}</span>
        )}

        {hasVariants ? (
          <div className="variant-pick" onClick={stop}>
            <select
              className="variant-select"
              aria-label={`Choose option for ${product.name}`}
              value={vIndex}
              onClick={stop}
              onChange={(e) => setVIndex(Number(e.target.value))}
            >
              {variants.map((v, i) => (
                <option key={v.label + i} value={i}>
                  {v.label} — ₹{variantEffectivePrice(v)}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="card-price-row">
          <span className="price-now">{rupee(shownPrice)}</span>
          {shownStruck != null && (
            <span className="price-was">{rupee(shownStruck)}</span>
          )}
        </div>
        {variant ? (
          <span className="card-unit">{variant.label}</span>
        ) : (
          unitLabel(product) && (
            <span className="card-unit">per {unitLabel(product)}</span>
          )
        )}

        <div className="card-actions">
          <button
            type="button"
            className="btn-add"
            onClick={onAdd}
            disabled={!available}
          >
            {added ? (
              <>
                <IconCheck style={{ width: 14, height: 14 }} /> Added
              </>
            ) : available ? (
              'Add to Cart'
            ) : (
              'Sold Out'
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
