/*************************************************************
 *  GROZO — Google Apps Script backend (Code.gs)
 *  -----------------------------------------------------------
 *  A single Web App that serves your Google Sheet as a JSON API
 *  and saves incoming orders. No Node, no Firebase, no DB.
 *
 *  SHEETS expected in this Spreadsheet (tab names matter):
 *    Products    id | name | tamil_name | category | price |
 *                offer_price | unit | unitType | unitValue |
 *                hasVariants | variantOptions | stock | image |
 *                origin | description | featured | active
 *    Categories  id | name | image | active
 *    Banners     id | image | title | subtitle | active
 *    Settings    key | value
 *    Orders      order_id | date | customer_name | phone |
 *                address | items | total | status   (+ optional notes)
 *
 *  UNITS & VARIANTS (all admin-editable from the sheet):
 *    unitType        kg | g | piece | dozen | litre | ml | pack |
 *                    box | tray | bunch | … (any label you type)
 *    unitValue       number the base price covers (1, 500, 250 …)
 *    hasVariants     TRUE to enable multiple purchase options
 *    variantOptions  JSON array, e.g.
 *                    [{"label":"500g","price":25},
 *                     {"label":"1kg","price":40}]
 *                    (an optional "offer_price" per option is allowed)
 *
 *  ENDPOINTS (GET unless noted):
 *    ?action=products
 *    ?action=product&id=1
 *    ?action=categories
 *    ?action=banners
 *    ?action=settings
 *    ?action=featured
 *    ?action=search&q=carrot
 *    ?action=category&category=Vegetables
 *    ?action=saveOrder        (POST, body = JSON order)
 *
 *  All responses: { ok: true, data: ... } or { ok:false, error }.
 *  CORS is open (deploy as "Anyone").
 *************************************************************/

// ---------- Routing ----------

function doGet(e) {
  return handle(e, e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  // Body may carry the order JSON (sent as text/plain to avoid preflight).
  var body = {};
  if (e && e.postData && e.postData.contents) {
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      body = {};
    }
  }
  return handle(e, params, body);
}

function handle(e, params, body) {
  var action = (params.action || '').toString();
  try {
    switch (action) {
      case 'products':
        return json({ ok: true, data: getActiveProducts() });
      case 'product':
        return json({ ok: true, data: getProductById(params.id) });
      case 'categories':
        return json({ ok: true, data: getActiveRows('Categories') });
      case 'banners':
        return json({ ok: true, data: getActiveRows('Banners') });
      case 'settings':
        return json({ ok: true, data: getRows('Settings') });
      case 'featured':
        return json({ ok: true, data: getFeatured() });
      case 'search':
        return json({ ok: true, data: searchProducts(params.q) });
      case 'category':
        return json({ ok: true, data: getByCategory(params.category) });
      case 'saveOrder':
        return json({ ok: true, data: saveOrder(body || params) });
      default:
        return json({ ok: false, error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

// ---------- JSON helper ----------

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------- Sheet readers ----------

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('Sheet not found: ' + name);
  return sheet;
}

// Read all rows of a sheet into objects keyed by the header row.
function getRows(name) {
  var sheet = getSheet(name);
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0].map(function (h) {
    return String(h).trim();
  });
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    // Skip fully blank rows.
    if (row.join('').toString().trim() === '') continue;
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      if (headers[c] === '') continue;
      obj[headers[c]] = row[c];
    }
    rows.push(obj);
  }
  return rows;
}

// Rows where the "active" column is truthy.
function getActiveRows(name) {
  return getRows(name).filter(function (r) {
    return isTrue(r.active);
  });
}

function isTrue(v) {
  if (v === true) return true;
  var s = String(v).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === '';
  // NOTE: blank counts as active so admins can leave it empty.
}

// ---------- Product queries ----------

// All active products, with units normalized and variantOptions parsed
// from their JSON string into a real array. Every product-returning
// endpoint goes through here so the API is consistent.
function getActiveProducts() {
  return getActiveRows('Products').map(decorateProduct);
}

// Normalize one product row coming out of the sheet.
function decorateProduct(p) {
  // Units: fall back to the legacy `unit` column for older sheets.
  if (p.unitType === undefined || String(p.unitType).trim() === '') {
    p.unitType = p.unit || '';
  }
  var uv = Number(p.unitValue);
  p.unitValue = isFinite(uv) && uv > 0 ? uv : 1;

  // Variant options: parse the JSON string into an array.
  p.variantOptions = parseVariantOptions(p.variantOptions);

  // hasVariants is true only when explicitly enabled AND options exist.
  var enabled = isTrueStrict(p.hasVariants);
  p.hasVariants = enabled && p.variantOptions.length > 0;

  return p;
}

// Parse the variantOptions cell (a JSON string) into a clean array.
// Returns [] on anything malformed so the API never throws.
function parseVariantOptions(v) {
  if (!v) return [];
  if (Object.prototype.toString.call(v) === '[object Array]') return v;
  var s = String(v).trim();
  if (!s) return [];
  var arr;
  try {
    arr = JSON.parse(s);
  } catch (err) {
    return [];
  }
  if (Object.prototype.toString.call(arr) !== '[object Array]') return [];
  var out = [];
  for (var i = 0; i < arr.length; i++) {
    var o = arr[i];
    if (!o || o.label == null || o.price == null || o.price === '') continue;
    var price = Number(o.price);
    if (!isFinite(price)) continue;
    var opt = { label: String(o.label), price: price };
    if (o.offer_price != null && o.offer_price !== '') {
      var off = Number(o.offer_price);
      if (isFinite(off)) opt.offer_price = off;
    }
    out.push(opt);
  }
  return out;
}

function getProductById(id) {
  if (id === undefined || id === null) throw new Error('Missing product id');
  var rows = getActiveProducts();
  var match = rows.filter(function (p) {
    return String(p.id) === String(id);
  });
  return match.length ? match[0] : null;
}

function getFeatured() {
  return getActiveProducts().filter(function (p) {
    return isTrueStrict(p.featured);
  });
}

// Strict truthy — used for "featured" so a blank does NOT mean featured.
function isTrueStrict(v) {
  if (v === true) return true;
  var s = String(v).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'y';
}

function searchProducts(q) {
  var term = String(q || '').trim().toLowerCase();
  if (!term) return [];
  return getActiveProducts().filter(function (p) {
    return (
      String(p.name || '').toLowerCase().indexOf(term) !== -1 ||
      String(p.tamil_name || '').toLowerCase().indexOf(term) !== -1 ||
      String(p.category || '').toLowerCase().indexOf(term) !== -1 ||
      String(p.origin || '').toLowerCase().indexOf(term) !== -1
    );
  });
}

function getByCategory(category) {
  var key = String(category || '').trim().toLowerCase();
  if (!key) return [];
  return getActiveProducts().filter(function (p) {
    return String(p.category || '').trim().toLowerCase() === key;
  });
}

// ---------- Orders ----------

function saveOrder(order) {
  if (!order || !order.customer_name) {
    throw new Error('Order is missing customer details');
  }
  var sheet = getSheet('Orders');
  var headers = sheet.getDataRange().getValues()[0].map(function (h) {
    return String(h).trim();
  });

  var orderId = order.order_id || 'GRZ' + new Date().getTime();
  var record = {
    order_id: orderId,
    date: order.date || new Date().toISOString(),
    customer_name: order.customer_name || '',
    phone: order.phone || '',
    address: order.address || '',
    items: order.items || '',
    total: order.total || 0,
    status: order.status || 'NEW',
    notes: order.notes || ''
  };

  // Build the row in the exact order of the sheet headers, so admins
  // can reorder columns without breaking anything.
  var rowValues = headers.map(function (h) {
    return record[h] !== undefined ? record[h] : '';
  });
  sheet.appendRow(rowValues);

  return { order_id: orderId, saved: true };
}

// ---------- One-time setup helper (optional) ----------
// Run this once from the Apps Script editor to create all the tabs
// with the right headers and a couple of sample rows.
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  function ensure(name, headers, samples) {
    var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    if (samples && samples.length) {
      sheet.getRange(2, 1, samples.length, headers.length).setValues(samples);
    }
    sheet.setFrozenRows(1);
  }

  ensure(
    'Products',
    ['id', 'name', 'tamil_name', 'category', 'price', 'offer_price', 'unit', 'unitType', 'unitValue', 'hasVariants', 'variantOptions', 'stock', 'image', 'origin', 'description', 'featured', 'active'],
    [
      [1, 'Carrot', 'கேரட்', 'Vegetables', 60, 49, 'kg', 'kg', 1, 'FALSE', '', 25, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600', 'Ooty', 'Sweet hill carrots, freshly pulled this morning.', 'TRUE', 'TRUE'],
      [2, 'Beetroot', 'பீட்ரூட்', 'Vegetables', 50, '', 'kg', 'kg', 1, 'FALSE', '', 18, 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=600', 'Ooty', 'Deep red, earthy and crisp.', 'TRUE', 'TRUE'],
      [3, 'Tomato', 'தக்காளி', 'Vegetables', 40, '', 'kg', 'kg', 1, 'TRUE', '[{"label":"500g","price":25},{"label":"1kg","price":40},{"label":"2kg","price":75}]', 40, 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=600', 'Thondamuthur', 'Vine-ripened country tomatoes.', 'TRUE', 'TRUE'],
      [4, 'Ladies Finger', 'வெண்டைக்காய்', 'Vegetables', 45, '', 'kg', 'kg', 1, 'FALSE', '', 22, 'https://images.unsplash.com/photo-1664289400982-1b6a0a3a73e9?w=600', 'Thondamuthur', 'Tender okra, no fibres.', 'FALSE', 'TRUE'],
      [5, 'Apple', 'ஆப்பிள்', 'Fruits', 170, '', 'kg', 'kg', 1, 'TRUE', '[{"label":"250g","price":50},{"label":"500g","price":90},{"label":"1kg","price":170}]', 35, 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600', 'Ooty', 'Crisp hill-grown apples.', 'TRUE', 'TRUE'],
      [6, 'Coconut', 'தேங்காய்', 'Fruits', 35, '', 'piece', 'piece', 1, 'TRUE', '[{"label":"1 Piece","price":35},{"label":"2 Pieces","price":65}]', 50, 'https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=600', 'Thondamuthur', 'Fresh whole coconuts.', 'FALSE', 'TRUE'],
      [7, 'Banana', 'வாழைப்பழம்', 'Fruits', 50, 44, 'dozen', 'dozen', 1, 'FALSE', '', 30, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600', 'Thondamuthur', 'Naturally ripened nendran bananas.', 'TRUE', 'TRUE'],
      [8, 'Farm Milk', 'பால்', 'Dairy', 30, '', 'litre', 'litre', 1, 'FALSE', '', 20, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600', 'Thondamuthur', 'Fresh cow milk, delivered daily.', 'FALSE', 'TRUE']
    ]
  );

  ensure(
    'Categories',
    ['id', 'name', 'image', 'active'],
    [
      [1, 'Vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300', 'TRUE'],
      [2, 'Fruits', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300', 'TRUE'],
      [3, 'Greens', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300', 'TRUE'],
      [4, 'Dairy', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', 'TRUE']
    ]
  );

  ensure(
    'Banners',
    ['id', 'image', 'title', 'subtitle', 'active'],
    [
      [1, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200', 'Fresh From Farmer', 'Direct farm fresh vegetables & fruits', 'TRUE'],
      [2, 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200', 'No Delivery Charges', 'Low prices compared to grocery apps', 'TRUE']
    ]
  );

  ensure(
    'Settings',
    ['key', 'value'],
    [
      ['site_name', 'GROZO'],
      ['phone', '9876543210'],
      ['whatsapp', '919876543210'],
      ['address', 'No.12 Main Road, Coimbatore'],
      ['delivery_message', 'No Delivery Charges'],
      ['hero_title', 'Fresh From Farmer'],
      ['hero_subtitle', 'Direct Farm Fresh Vegetables & Fruits']
    ]
  );

  ensure(
    'Orders',
    ['order_id', 'date', 'customer_name', 'phone', 'address', 'items', 'total', 'status', 'notes'],
    []
  );

  SpreadsheetApp.getUi && SpreadsheetApp.getActiveSpreadsheet().toast('GROZO sheets ready ✅');
}
