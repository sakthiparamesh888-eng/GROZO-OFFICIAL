import { Link } from 'react-router-dom';
import { SkeletonLine } from './Skeleton.jsx';

export default function CategoryList({ categories = [], loading }) {
  if (loading) {
    return (
      <div className="cat-rail">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="cat-chip" key={i}>
            <div
              className="skeleton"
              style={{ width: 84, height: 84, borderRadius: '50%' }}
            />
            <SkeletonLine width="60%" height={10} style={{ margin: '8px auto 0' }} />
          </div>
        ))}
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <div className="cat-rail">
      {categories.map((c) => (
        <Link
          to={`/category/${encodeURIComponent(c.name)}`}
          className="cat-chip"
          key={c.id}
        >
          <img
            className="cat-img"
            src={c.image}
            alt={c.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml;utf8,' +
                encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23e8f5e9"/><text x="50%" y="50%" font-size="40" text-anchor="middle" dy=".35em">🥗</text></svg>'
                );
            }}
          />
          <div className="cat-name">{c.name}</div>
        </Link>
      ))}
    </div>
  );
}
