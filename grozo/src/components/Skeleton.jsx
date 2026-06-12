// Skeleton placeholders shown while data loads.

export function SkeletonCard() {
  return (
    <div className="card sk-card" aria-hidden="true">
      <div className="skeleton sk-img" />
      <div className="card-body">
        <div className="skeleton sk-line" />
        <div className="skeleton sk-line short" />
        <div className="skeleton sk-line short" style={{ marginTop: 10 }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 9 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonLine({ width = '100%', height = 14, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}
