import { useParams, Link } from 'react-router-dom';
import { useCategoryProducts } from '../hooks/useProducts.js';
import ProductGrid from '../components/ProductGrid.jsx';

export default function CategoryPage() {
  const { name } = useParams();
  const category = decodeURIComponent(name || '');
  const { products, loading, error } = useCategoryProducts(category);

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> · {category}
      </div>
      <div className="section-head" style={{ marginTop: 12 }}>
        <div>
          <span className="section-eyebrow">Category</span>
          <h1 className="section-title">{category}</h1>
        </div>
      </div>
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        emptyText={`No products in ${category} right now.`}
      />
      <div style={{ height: 30 }} />
    </div>
  );
}
