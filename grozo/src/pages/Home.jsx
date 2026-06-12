import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { getBanners, getCategories, getFeatured } from '../services/api.js';
import { useProducts } from '../hooks/useProducts.js';
import { useSettings } from '../hooks/useSettings.jsx';
import { isTrue } from '../utils/format.js';

import BannerSlider from '../components/BannerSlider.jsx';
import CategoryList from '../components/CategoryList.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import FarmCollection from '../components/FarmCollection.jsx';
import WhyChooseUs from '../components/WhyChooseUs.jsx';
import TrustSection from '../components/TrustSection.jsx';
import ContactSection from '../components/ContactSection.jsx';
import { IconArrow } from '../components/icons.jsx';

// Match a product's origin against a place name, case-insensitively.
function fromPlace(products, place) {
  const key = place.toLowerCase();
  return products.filter((p) =>
    String(p.origin || '').toLowerCase().includes(key)
  );
}

export default function Home() {
  const { settings } = useSettings();
  const banners = useFetch(getBanners, []);
  const categories = useFetch(getCategories, []);
  const featured = useFetch(getFeatured, []);
  const { products, loading: productsLoading } = useProducts();

  const activeBanners = (banners.data || []).filter((b) => isTrue(b.active));
  const activeCategories = (categories.data || []).filter((c) => isTrue(c.active));

  const ooty = fromPlace(products, 'Ooty');
  const thondamuthur = fromPlace(products, 'Thondamuthur');

  return (
    <>
      {/* Top farm message strip */}
      <div className="farm-strip">🌿 Fresh From Farmer — {settings.delivery_message}</div>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span
              className="section-eyebrow"
              style={{ color: 'var(--green-100)' }}
            >
              Direct Farm Fresh
            </span>
            <h1 className="hero-title">{settings.hero_title}</h1>
            <p className="hero-sub">{settings.hero_subtitle}</p>
            <div className="hero-points">
              <span className="hero-chip">✅ Real photos, not stock images</span>
              <span className="hero-chip">✅ No packing costs</span>
              <span className="hero-chip">✅ {settings.delivery_message}</span>
            </div>
            <div className="hero-cta-row">
              <a href="#featured" className="btn btn-primary btn-lg">
                Shop Fresh <IconArrow style={{ width: 18, height: 18 }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Banner slider */}
      {(banners.loading || activeBanners.length > 0) && (
        <section className="section">
          <div className="container">
            {banners.loading ? (
              <div
                className="skeleton"
                style={{ aspectRatio: '21/9', borderRadius: 'var(--r-lg)' }}
              />
            ) : (
              <BannerSlider banners={activeBanners} />
            )}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Browse</span>
              <h2 className="section-title">Shop by Category</h2>
            </div>
          </div>
          <CategoryList
            categories={activeCategories}
            loading={categories.loading}
          />
        </div>
      </section>

      {/* Featured */}
      <section className="section" id="featured">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Today’s picks</span>
              <h2 className="section-title">Featured Products</h2>
            </div>
          </div>
          <ProductGrid
            products={featured.data || []}
            loading={featured.loading}
            error={featured.error}
            emptyText="No featured products today."
          />
        </div>
      </section>

      {/* Ooty Collection */}
      <div className="container">
        <FarmCollection
          eyebrow="Hill-grown"
          title="Ooty Fresh Collection"
          label="Direct From Ooty"
          products={ooty}
          loading={productsLoading}
        />
      </div>

      {/* Thondamuthur Collection */}
      <div className="container">
        <FarmCollection
          eyebrow="Village-grown"
          title="Thondamuthur Fresh Collection"
          label="Direct From Thondamuthur"
          products={thondamuthur}
          loading={productsLoading}
        />
      </div>

      <WhyChooseUs />
      <TrustSection />
      <ContactSection />
    </>
  );
}
