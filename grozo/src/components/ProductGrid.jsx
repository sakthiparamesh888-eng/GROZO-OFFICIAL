import ProductCard from './ProductCard.jsx';
import { SkeletonGrid } from './Skeleton.jsx';

export default function ProductGrid({
  products = [],
  loading,
  error,
  skeletonCount = 9,
  emptyText = 'No products to show yet.'
}) {
  if (loading) return <SkeletonGrid count={skeletonCount} />;

  if (error) {
    return (
      <div className="notice">
        Couldn’t load products: {error}. Please refresh in a moment.
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="empty">
        <div className="icon">🧺</div>
        <h3>{emptyText}</h3>
        <p>Check back soon — fresh stock is added daily.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
