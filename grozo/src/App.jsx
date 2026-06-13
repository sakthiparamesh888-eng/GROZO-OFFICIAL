import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { ScrollToTop } from './components/ScrollToTop.jsx';
import PopupBanner from './components/PopupBanner';
import popupBanner from './assets/banners/popup-banner.jpg';
import {
  ExitIntentPopup,
  FloatingSocialBar
} from './components/SocialMarketing';

import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import SearchPage from './pages/SearchPage.jsx';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <PopupBanner
        title="Fresh Vegetables Delivered"
        subtitle="Special Offer"
        description="Get up to 40% OFF on fresh fruits and vegetables."
        buttonText="Shop Now"
        image={popupBanner}
        buttonLink="/"
      />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="*"
            element={
              <div className="container">
                <div className="empty">
                  <div className="icon">🌿</div>
                  <h3>Page not found</h3>
                  <p>Let’s get you back to fresh produce.</p>
                  <a href="/" className="btn btn-primary" style={{ marginTop: 14 }}>
                    Back to home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <FloatingSocialBar />
      <ExitIntentPopup />
    </>
  );
}
