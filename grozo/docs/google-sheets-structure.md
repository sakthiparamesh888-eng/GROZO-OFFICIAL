# GROZO — Google Sheets structure

Create **one** Google Spreadsheet with these five tabs. Tab names must match
exactly (case-sensitive). The header row is row 1.

> Tip: open the Apps Script editor (Extensions → Apps Script), paste `Code.gs`,
> and run the `setupSheets()` function once. It builds all five tabs with the
> correct headers and a few sample rows automatically.

---

## 1. Products

| id | name | tamil_name | category | price | offer_price | unit | unitType | unitValue | hasVariants | variantOptions | stock | image | origin | description | featured | active |
|----|------|-----------|----------|-------|-------------|------|----------|-----------|-------------|----------------|-------|-------|--------|-------------|----------|--------|
| 1 | Carrot | கேரட் | Vegetables | 60 | 49 | kg | kg | 1 | FALSE | | 25 | https://… | Ooty | Sweet hill carrots | TRUE | TRUE |
| 3 | Tomato | தக்காளி | Vegetables | 40 | | kg | kg | 1 | TRUE | `[{"label":"500g","price":25},{"label":"1kg","price":40},{"label":"2kg","price":75}]` | 40 | https://… | Thondamuthur | Vine-ripened tomatoes | TRUE | TRUE |
| 6 | Coconut | தேங்காய் | Fruits | 35 | | piece | piece | 1 | TRUE | `[{"label":"1 Piece","price":35},{"label":"2 Pieces","price":65}]` | 50 | https://… | Thondamuthur | Fresh coconuts | FALSE | TRUE |

- **id** — unique number or code.
- **price** — regular price (number only, no ₹). For products **with** variants this is just a fallback; the variant prices take over.
- **offer_price** — optional. Leave blank for no offer. Must be lower than price.
- **unit** — legacy column, still read as a fallback. New sheets can leave it equal to `unitType`.
- **unitType** — the unit the product is sold by. **Type anything** — `kg`, `g`, `piece`, `dozen`, `litre`, `ml`, `pack`, `box`, `tray`, `bunch`, … No code change needed to add a new unit.
- **unitValue** — how many of that unit the base price covers. `1` → shows "per kg" / "per piece". `500` with unitType `g` → shows the price "per 500g". Blank = `1`.
- **hasVariants** — `TRUE` to turn on multiple purchase options (a size/weight picker). `FALSE` or blank = single price.
- **variantOptions** — only used when `hasVariants` is `TRUE`. A **JSON array** of options, each with a `label` and a `price`. You may add an optional `offer_price` per option. Examples:
  - Tomato: `[{"label":"500g","price":25},{"label":"1kg","price":40},{"label":"2kg","price":75}]`
  - Apple: `[{"label":"250g","price":50},{"label":"500g","price":90},{"label":"1kg","price":170}]`
  - Coconut: `[{"label":"1 Piece","price":35},{"label":"2 Pieces","price":65}]`
  - With an offer on one option: `[{"label":"1kg","price":40,"offer_price":32}]`
  - **Add or remove options anytime, straight from the sheet — the dropdown on the site updates automatically.** If the JSON is malformed, the product simply falls back to its single base price (it never breaks the site).
- **stock** — number. `0` → sold out. Blank = treated as in stock.
- **image** — full public image URL (upload real photos to Drive/Imgur/etc. and paste the direct link).
- **origin** — the farm/place. **This drives the home-page collections:** any product whose origin contains `Ooty` appears in *Ooty Fresh Collection*; anything containing `Thondamuthur` appears in *Thondamuthur Fresh Collection*. Nothing is hardcoded — you control these sections from this column.
- **featured** — TRUE shows it in the Featured Products section.
- **active** — TRUE shows it on the site. FALSE hides it.

### How units & variants appear on the site
- **No variants:** the card and details page show the price with the unit, e.g. `₹40 / kg`, `₹35 / piece`, `₹30 / litre`.
- **With variants:** the card shows a compact dropdown and the details page shows tappable option chips. Picking an option updates the price instantly, and the chosen option is carried through the cart, checkout, the WhatsApp message, and the saved order.

### Suggested Ooty origin products
Carrot, Beetroot, Chow Chow, Cauliflower, Broccoli, Cabbage, Potato — set their `origin` to **Ooty**.

### Suggested Thondamuthur origin products
Vendakkai, Surakkai, Peerkangai, Pudalangai, Kovakkai, Kathirikkai, Vazhakkai, Mullangi — set their `origin` to **Thondamuthur**.

---

## 2. Categories

| id | name | image | active |
|----|------|-------|--------|
| 1 | Vegetables | https://… | TRUE |

- **name** — must match the `category` value used in Products for filtering to work.

---

## 3. Banners

| id | image | title | subtitle | active |
|----|-------|-------|----------|--------|
| 1 | https://… | Fresh From Farmer | Direct farm fresh vegetables & fruits | TRUE |

Wide images work best (roughly 21:9). The slider auto-rotates.

---

## 4. Settings

| key | value |
|-----|-------|
| site_name | GROZO |
| phone | 9876543210 |
| whatsapp | 919876543210 |
| address | No.12 Main Road, Coimbatore |
| delivery_message | No Delivery Charges |
| hero_title | Fresh From Farmer |
| hero_subtitle | Direct Farm Fresh Vegetables & Fruits |

- **whatsapp** — full international format, **no `+` and no spaces** (country code + number), e.g. `919876543210`. This is the number that receives orders.
- **phone** — the tap-to-call number shown in the header/footer.

Everything in the header, footer, hero and contact section reads from here. No
text is hardcoded in the app.

---

## 5. Orders

| order_id | date | customer_name | phone | address | items | total | status | notes |
|----------|------|---------------|-------|---------|-------|-------|--------|-------|

This tab is written to automatically when a customer places an order. You don't
fill it in. New orders arrive with status `NEW` — you can change the status as
you process them.

The **items** column stores a JSON array with the full detail of each line,
including the exact variant/unit purchased — never just the product name:

```json
[
  { "name": "Tomato",  "variant": "1kg",    "price": 40, "qty": 2, "amount": 80 },
  { "name": "Apple",   "variant": "500g",   "price": 90, "qty": 1, "amount": 90 },
  { "name": "Coconut", "variant": "1 Piece","price": 35, "qty": 3, "amount": 105 }
]
```

The same per-line variant detail is included in the WhatsApp order message the
customer sends you, e.g. `Tomato (1kg) x 2 = ₹80`.
