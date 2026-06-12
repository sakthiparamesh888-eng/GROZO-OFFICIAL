import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/api.js';
import { rupee, effectivePrice } from '../utils/format.js';
import { IconSearch, IconClose } from './icons.jsx';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  // Debounced live search.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const data = await searchProducts(term);
        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [q]);

  // Close on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) {
      setOpen(false);
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  const goTo = (id) => {
    setOpen(false);
    setQ('');
    navigate(`/product/${id}`);
  };

  return (
    <div className="header-search" ref={boxRef}>
      <form onSubmit={submit} role="search">
        <IconSearch className="search-icon" />
        <input
          className="search-input"
          type="search"
          value={q}
          placeholder="Search vegetables, fruits, தமிழ் பெயர்…"
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => q.trim().length >= 2 && setOpen(true)}
          aria-label="Search products"
        />
        {q && (
          <button
            type="button"
            className="search-clear"
            onClick={() => {
              setQ('');
              setResults([]);
            }}
            aria-label="Clear search"
          >
            <IconClose style={{ width: 16, height: 16 }} />
          </button>
        )}
      </form>

      {open && q.trim().length >= 2 && (
        <div className="search-results">
          {loading && <div className="search-empty">Searching…</div>}
          {!loading && results.length === 0 && (
            <div className="search-empty">No matches for “{q}”.</div>
          )}
          {!loading &&
            results.slice(0, 8).map((p) => (
              <button
                key={p.id}
                type="button"
                className="search-result"
                onClick={() => goTo(p.id)}
              >
                <img src={p.image} alt="" loading="lazy" />
                <span style={{ flex: 1, textAlign: 'left' }}>
                  <span className="sr-name">{p.name}</span>
                  <br />
                  <span className="sr-sub tamil">
                    {p.tamil_name} · {p.category}
                  </span>
                </span>
                <span className="price-now">{rupee(effectivePrice(p))}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
