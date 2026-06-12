# 🌿 GROZO — Farm-Direct Vegetables & Fruits

A production-ready, fully dynamic grocery ecommerce site.
**React + Vite** frontend, **Google Sheets + Apps Script** backend.
No Node server, no Firebase, no hardcoded data — everything (products, prices,
images, categories, banners, phone, address, WhatsApp, all text) comes from your
Google Sheet.

- Mobile-first, **exactly 3 products per row at 359px**, scaling to 4 (tablet) / 5 (laptop) / 6 (desktop) via CSS Grid.
- Green + white modern grocery UI, real photos, Tamil names.
- WhatsApp checkout + orders saved to Google Sheets. No payment gateway.

---

## 📁 Project structure

```
grozo/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                 # SPA routing for Vercel
├── google-apps-script/
│   └── Code.gs                 # the entire backend API
├── docs/
│   └── google-sheets-structure.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── config.js               # ← paste your Apps Script URL here
    ├── components/             # Header, Footer, ProductCard, SearchBar, …
    ├── pages/                  # Home, ProductDetails, Cart, Checkout, …
    ├── context/                # CartContext
    ├── hooks/                  # useProducts, useSettings, useFetch
    ├── services/               # api.js (fetch + caching)
    ├── utils/                  # format.js, whatsapp.js
    ├── assets/                 # logo.svg
    └── styles/                 # global.css (design tokens + grid)
```

---

## 🧩 Part 1 — Google Sheets database

1. Create a new Google Spreadsheet.
2. See [`docs/google-sheets-structure.md`](docs/google-sheets-structure.md) for the five tabs:
   **Products, Categories, Banners, Settings, Orders**.
3. Fastest way: open **Extensions → Apps Script**, paste the contents of
   `google-apps-script/Code.gs`, then run the **`setupSheets`** function once.
   It creates every tab with correct headers and sample rows.

---

## ⚙️ Part 2 — Deploy the Apps Script API

1. In your Spreadsheet: **Extensions → Apps Script**.
2. Delete any starter code, paste all of `google-apps-script/Code.gs`, **Save**.
3. (Optional) Run `setupSheets` once and **authorize** when prompted.
4. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Description: `GROZO API`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, authorize, and **copy the Web App URL** (it ends in `/exec`).

> Re-deploying after edits: use **Deploy → Manage deployments → Edit (pencil) →
> Version: New version → Deploy** so the URL stays the same.

### Why CORS just works
- All reads are plain `GET` requests — browsers allow these to a public Web App.
- The order POST is sent as `text/plain`, which is a "simple request", so the
  browser skips the CORS preflight that Apps Script can't answer. No extra
  config needed.

---

## 💻 Part 3 — Run the frontend locally

Requires Node.js 18+.

```bash
npm install
```

Open `src/config.js` and paste your Web App URL:

```js
export const API_BASE = 'https://script.google.com/macros/s/XXXXXXXX/exec';
```

(Or create a `.env` file: `VITE_API_BASE=https://script.google.com/macros/s/XXXXXXXX/exec`)

Then:

```bash
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

---

## ▲ Part 4 — Deploy to Vercel

**Option A — Dashboard**
1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com): **Add New → Project → Import** the repo.
3. Framework preset: **Vite** (auto-detected).
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add an Environment Variable:
   - `VITE_API_BASE` = your Apps Script `/exec` URL
5. **Deploy.**

`vercel.json` already rewrites all routes to `index.html` so React Router deep
links (e.g. `/product/3`) work on refresh.

**Option B — CLI**
```bash
npm i -g vercel
vercel            # follow prompts
vercel --prod     # production deploy
```

Also works the same way on **Netlify** (build `npm run build`, publish `dist`,
add a `/* → /index.html` redirect) or **Cloudflare Pages**.

---

## 🛒 How ordering works

1. Customer adds items → Cart → Checkout.
2. They enter name, phone, address, landmark, notes.
3. **Place Order** does two things:
   - Saves the order row to the **Orders** sheet (via Apps Script).
   - Opens **WhatsApp** to your number with a formatted order message.
4. No payment gateway — you confirm on WhatsApp, pay on delivery.

---

## 🔧 Admin: change anything without touching code

| Want to change… | Edit this |
|---|---|
| Products, prices, offers, photos, stock | **Products** sheet |
| Units (kg, g, piece, dozen, litre, ml, pack, box, tray, bunch…) | `unitType` + `unitValue` columns |
| Multiple sizes/options + their prices (e.g. 500g / 1kg / 2kg) | `hasVariants` → TRUE and the `variantOptions` JSON column |
| Featured products | `featured` column → TRUE |
| Ooty / Thondamuthur sections | `origin` column → `Ooty` / `Thondamuthur` |
| Categories | **Categories** sheet |
| Homepage banners | **Banners** sheet |
| Site name, phone, WhatsApp, address, hero text, delivery message | **Settings** sheet |

Changes appear within ~5 minutes (the app caches responses for speed; hard-refresh to see them instantly).

---

## ✅ Requirements checklist

- [x] React + Vite + React Router, plain CSS (no Tailwind)
- [x] Mobile-first, 3/4/5/6 products per row via CSS Grid, no horizontal scroll at 359px
- [x] Green + white professional grocery UI, animations, hover effects
- [x] Google Sheets DB + Apps Script API, CORS, all endpoints
- [x] Dynamic everything — no hardcoded products/prices/text
- [x] Live search (name / Tamil name / category)
- [x] Cart with qty controls, ₹0 delivery, grand total
- [x] WhatsApp checkout + order saved to Sheets
- [x] Sticky header (logo, search, cart count, call, WhatsApp)
- [x] Dynamic footer from Settings
- [x] Lazy images, skeleton loaders, API caching, SEO meta
- [x] Vercel-ready
```
