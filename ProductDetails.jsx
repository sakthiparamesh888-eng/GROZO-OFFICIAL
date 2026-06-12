import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProductDetails } from '../hooks/useProducts.js';
import { useCart } from '../context/CartContext.jsx';
import { getByCategory } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
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
import QuantitySelector from '../components/QuantitySelector.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { SkeletonLine } from '../components/Skeleton.jsx';
import { IconCart, IconCheck } from '../components/icons.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const { product, loading, error } = useProductDetails(id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [vIndex, setVIndex] = useState(0);

  // Related = same category (loads once product is known).
  const related = useFetch(
    () => (product?.category ? getByCategory(product.category) : Promise.resolve([])),
    [product?.category]
  );

  if (loading) {
    return (
      <div className="container">
        <div className="pd">
          <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: 'var(--r-lg)' }} />
          <div>
            <SkeletonLine width="70%" height={28} />
            <SkeletonLine width="40%" height={16} style={{ marginTop: 12 }} />
            <SkeletonLine width="50%" height={30} style={{ marginTop: 20 }} />
            <SkeletonLine width="100%" height={14} style={{ marginTop: 20 }} />
            <SkeletonLine width="90%" height={14} style={{ marginTop: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="empty">
          <div className="icon">🔍</div>
          <h3>Product not found</h3>
          <p>It may have sold out or been removed.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 14 }}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const available = inStock(product);
  const hasVariants = productHasVariants(product);
  const variants = hasVariants ? parseVariants(product) : [];
  const variant = hasVariants ? variants[vIndex] : null;

  const shownPrice = variant ? variantEffectivePrice(variant) : effectivePrice(product);
  const shownStruck = variant
    ? variantHasOffer(variant)
      ? variant.price
      : null
    : hasOffer(product)
    ? product.price
    : null;
  const shownSave = variant
    ? variantHasOffer(variant)
      ? Math.round(((variant.price - variantEffectivePrice(variant)) / variant.price) * 100)
      : 0
    : discountPercent(product);

  const onAdd = () => {
    if (!available) return;
    addItem(product, qty, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const relatedProducts = (related.data || []).filter(
    (p) => String(p.id) !== String(product.id)
  );

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> ·{' '}
        <Link to={`/category/${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>{' '}
        · {product.name}
      </div>

      <div className="pd">
        <div className="pd-media">
          <img src={product.image} alt={product.name} />
          {shownStruck != null && (
            <span className="badge badge-offer" style={{ top: 12, left: 12 }}>
              {shownSave}% OFF
            </span>
          )}
        </div>

        <div>
          <h1 className="pd-title">{product.name}</h1>
          {product.tamil_name && <div className="pd-tamil">{product.tamil_name}</div>}

          <div className="pd-price-row">
            <span className="pd-price">{rupee(shownPrice)}</span>
            {shownStruck != null && (
              <>
                <span className="pd-was">{rupee(shownStruck)}</span>
                <span className="pd-save">Save {shownSave}%</span>
              </>
            )}
            {!variant && unitLabel(product) && (
              <span className="pd-per">/ {unitLabel(product)}</span>
            )}
          </div>

          {/* Variant selector */}
          {hasVariants && (
            <div className="variant-block">
              <div className="variant-label">Select option</div>
              <div className="variant-options" role="group" aria-label="Choose an option">
                {variants.map((v, i) => (
                  <button
                    key={v.label + i}
                    type="button"
                    className={`variant-chip${i === vIndex ? ' active' : ''}`}
                    aria-pressed={i === vIndex}
                    onClick={() => setVIndex(i)}
                  >
                    <span className="vc-label">{v.label}</span>
                    <span className="vc-price">{rupee(variantEffectivePrice(v))}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-meta">
            {!hasVariants && unitLabel(product) && (
              <span className="pd-tag">Sold per {unitLabel(product)}</span>
            )}
            {product.origin && <span className="pd-tag">📍 {product.origin}</span>}
            {product.category && <span className="pd-tag">{product.category}</span>}
            <span className="pd-tag" style={{ color: available ? 'var(--green-700)' : '#c62828' }}>
              {available ? '● In stock' : '● Out of stock'}
            </span>
          </div>

          {product.description && <p className="pd-desc">{product.description}</p>}

          <div className="pd-buy">
            <QuantitySelector value={qty} onChange={setQty} />
            <button
              className="btn btn-primary btn-lg"
              onClick={onAdd}
              disabled={!available}
            >
              {added ? (
                <>
                  <IconCheck style={{ width: 18, height: 18 }} /> Added to cart
                </>
              ) : (
                <>
                  <IconCart style={{ width: 18, height: 18 }} />
                  {available ? 'Add to Cart' : 'Sold Out'}
                </>
              )}
            </button>
          </div>

          {added && (
            <Link to="/cart" className="section-link" style={{ display: 'inline-block', marginTop: 12 }}>
              Go to cart →
            </Link>
          )}
        </div>
      </div>

      {/* Related */}
      {(related.loading || relatedProducts.length > 0) && (
        <section className="section">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">You may also like</span>
              <h2 className="section-title">Related Products</h2>
            </div>
          </div>
          <ProductGrid
            products={relatedProducts}
            loading={related.loading}
            skeletonCount={6}
          />
        </section>
      )}
    </div>
  );
}
