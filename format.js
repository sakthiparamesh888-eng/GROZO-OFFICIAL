// =============================================================
//  GROZO — formatting & data helpers
// =============================================================

// Indian Rupee formatting, no decimals for whole numbers.
export function rupee(value) {
  const n = Number(value) || 0;
  return `₹${n.toLocaleString('en-IN', {
    maximumFractionDigits: n % 1 === 0 ? 0 : 2
  })}`;
}

// A product may have an offer_price. Return the price the customer pays.
export function effectivePrice(product) {
  const offer = Number(product.offer_price);
  const price = Number(product.price);
  if (offer && offer > 0 && offer < price) return offer;
  return price;
}

export function hasOffer(product) {
  const offer = Number(product.offer_price);
  const price = Number(product.price);
  return offer > 0 && offer < price;
}

export function discountPercent(product) {
  if (!hasOffer(product)) return 0;
  const price = Number(product.price);
  const offer = Number(product.offer_price);
  return Math.round(((price - offer) / price) * 100);
}

export function inStock(product) {
  // stock may be a number, or blank. Treat blank as in stock.
  if (product.stock === '' || product.stock === undefined || product.stock === null)
    return true;
  return Number(product.stock) > 0;
}

// Convert a Settings array [{key,value}] into a plain object.
export function settingsToObject(rows = []) {
  const obj = {};
  rows.forEach((r) => {
    if (r && r.key !== undefined) obj[String(r.key).trim()] = r.value;
  });
  return obj;
}

// Truthy check for sheet "active" / "featured" columns.
// Accepts TRUE / true / 1 / yes.
export function isTrue(v) {
  if (v === true) return true;
  const s = String(v).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'y';
}

// Explicit "no" check — used so an admin can switch a feature OFF.
function isFalse(v) {
  if (v === false) return true;
  const s = String(v).trim().toLowerCase();
  return s === 'false' || s === '0' || s === 'no' || s === 'n';
}

// =============================================================
//  UNITS & VARIANTS
//  Everything here is driven by the Google Sheet — no hardcoded
//  unit names. unitType is any label the admin types (kg, g,
//  piece, dozen, litre, ml, pack, box, tray, bunch, …).
// =============================================================

// Units that read better with no space before the value (500g, 250ml).
const COMPACT_UNITS = ['g', 'gram', 'grams', 'kg', 'ml', 'l', 'litre', 'liter', 'lit'];

// The unit a product is sold by, e.g. "kg", "piece", "500g", "250 ml".
// Falls back to the legacy `unit` column for backward compatibility.
export function unitLabel(product = {}) {
  const type = String(product.unitType || product.unit || '').trim();
  if (!type) return '';
  const valNum = Number(product.unitValue);
  const val = Number.isFinite(valNum) && valNum > 0 ? valNum : 1;
  if (val === 1) return type;
  const compact = COMPACT_UNITS.includes(type.toLowerCase());
  return compact ? `${val}${type}` : `${val} ${type}`;
}

// Suffix shown after a price, e.g. " / kg" or " / 500g". Empty when no unit.
export function perUnitSuffix(product = {}) {
  const label = unitLabel(product);
  return label ? ` / ${label}` : '';
}

// Parse the variantOptions cell. The backend usually sends a real array,
// but this also accepts a raw JSON string straight from the sheet so the
// frontend keeps working even against an older backend.
export function parseVariants(product = {}) {
  let raw = product.variantOptions;
  if (!raw) return [];
  let arr = raw;
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return [];
    try {
      arr = JSON.parse(s);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((o) => o && o.label != null && o.price != null && o.price !== '')
    .map((o) => ({
      label: String(o.label),
      price: Number(o.price),
      offer_price:
        o.offer_price != null && o.offer_price !== ''
          ? Number(o.offer_price)
          : ''
    }))
    .filter((o) => Number.isFinite(o.price) && o.price >= 0);
}

// True when the product offers multiple purchase options the user must pick.
export function productHasVariants(product = {}) {
  const opts = parseVariants(product);
  if (!opts.length) return false;
  // Respect an explicit FALSE; otherwise the presence of options is enough.
  if (isFalse(product.hasVariants)) return false;
  return true;
}

// Effective price for a single variant option (honours its own offer_price).
export function variantEffectivePrice(variant = {}) {
  const offer = Number(variant.offer_price);
  const price = Number(variant.price);
  if (offer && offer > 0 && offer < price) return offer;
  return price;
}

export function variantHasOffer(variant = {}) {
  const offer = Number(variant.offer_price);
  const price = Number(variant.price);
  return offer > 0 && offer < price;
}

// Lowest effective price across variants — used for "from ₹X" on cards.
export function startingPrice(product = {}) {
  const opts = parseVariants(product);
  if (!opts.length) return effectivePrice(product);
  return Math.min(...opts.map(variantEffectivePrice));
}
