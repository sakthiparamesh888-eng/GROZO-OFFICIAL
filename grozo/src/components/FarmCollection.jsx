import ProductGrid from './ProductGrid.jsx';
import { IconLeaf } from './icons.jsx';

// A farm collection is simply the set of products whose `origin`
// matches the given place — nothing hardcoded. Admins control which
// items appear by setting the origin column in the Products sheet
// (e.g. "Ooty" or "Thondamuthur").
export default function FarmCollection({
  title,
  label,
  products = [],
  loading,
  eyebrow
}) {
  // Hide the whole section if there is nothing for this farm yet.
  if (!loading && products.length === 0) return null;

  return (
    <section className="farm-section fade-up">
      <div className="container" style={{ padding: 0 }}>
        <span className="farm-label">
          <IconLeaf style={{ width: 14, height: 14 }} /> {label}
        </span>
        <div className="section-head">
          <div>
            {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
            <h2 className="section-title">{title}</h2>
          </div>
        </div>
        <ProductGrid
          products={products}
          loading={loading}
          skeletonCount={6}
          emptyText="No items from this farm today."
        />
      </div>
    </section>
  );
}
