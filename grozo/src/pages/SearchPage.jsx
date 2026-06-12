import { useSearchParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { searchProducts } from '../services/api.js';
import ProductGrid from '../components/ProductGrid.jsx';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { data, loading, error } = useFetch(
    () => (q ? searchProducts(q) : Promise.resolve([])),
    [q]
  );

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> · Search
      </div>
      <div className="section-head" style={{ marginTop: 12 }}>
        <div>
          <span className="section-eyebrow">Results</span>
          <h1 className="section-title">“{q}”</h1>
        </div>
      </div>
      <ProductGrid
        products={data || []}
        loading={loading}
        error={error}
        emptyText={`No products match “${q}”.`}
      />
      <div style={{ height: 30 }} />
    </div>
  );
}
