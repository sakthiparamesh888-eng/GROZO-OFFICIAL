import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { SettingsProvider } from './hooks/useSettings.jsx';
import { SocialMediaProvider } from './hooks/useSocialMedia.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <SocialMediaProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </SocialMediaProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
