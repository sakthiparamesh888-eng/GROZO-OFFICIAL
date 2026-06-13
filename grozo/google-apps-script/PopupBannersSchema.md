# PopupBanners Sheet Schema

## Columns

| Column | Type | Description |
|--------|------|-------------|
| id | String | Unique identifier (auto-generated or UUID) |
| popupType | String | OfferPopup, CouponPopup, FestivalPopup, WelcomePopup, FlashSalePopup, DeliveryUpdatePopup, NewArrivalPopup, ReferralPopup, SeasonalPopup |
| title | String | Main heading |
| subtitle | String | Secondary heading |
| description | String | Body text |
| image | String | Image URL (optional) |
| buttonText | String | CTA button label |
| buttonLink | String | CTA button href or action |
| couponCode | String | Code to copy (for CouponPopup) |
| backgroundColor | String | Hex color (#fff, #1b5e20, etc.) |
| textColor | String | Hex color for text |
| priority | Number | Display priority (higher = show first) |
| showOnce | Boolean | TRUE/FALSE - show only once per user |
| triggerType | String | onLoad, delay, exitIntent, scroll25, scroll50, scroll75, cartOpen, checkoutOpen |
| delaySeconds | Number | Delay before showing (for 'delay' trigger) |
| startDate | Date | Campaign start (YYYY-MM-DD) |
| endDate | Date | Campaign end (YYYY-MM-DD) |
| active | Boolean | TRUE/FALSE - enable/disable popup |

## Example Rows

```
id: popup_1
popupType: WelcomePopup
title: Welcome to GROZO Fresh
subtitle: Fresh Vegetables & Fruits Delivered Daily
description: Shop now and get 20% off on first order
image: https://...
buttonText: Shop Now
buttonLink: /
couponCode: GROZO20
backgroundColor: #1b5e20
textColor: #ffffff
priority: 100
showOnce: TRUE
triggerType: onLoad
delaySeconds: 2
startDate: 2026-01-01
endDate: 2026-12-31
active: TRUE

---

id: popup_2
popupType: FlashSalePopup
title: Flash Sale - Tomatoes
subtitle: 50% Off for Next 2 Hours
description: Limited stock available - Order now!
image: https://...
buttonText: Shop Now
buttonLink: /category/vegetables
couponCode: TOMATO50
backgroundColor: #ff6f00
textColor: #ffffff
priority: 90
showOnce: FALSE
triggerType: scroll25
delaySeconds: 0
startDate: 2026-06-01
endDate: 2026-06-30
active: TRUE

---

id: popup_3
popupType: CouponPopup
title: Exclusive Coupon for You
subtitle: Copy and apply at checkout
description: Get 15% off on orders above ₹500
image: https://...
buttonText: Copy Code
buttonLink: #
couponCode: GROZO15
backgroundColor: #e8f5e9
textColor: #1b5e20
priority: 80
showOnce: TRUE
triggerType: delay
delaySeconds: 5
startDate: 2026-01-01
endDate: 2026-12-31
active: TRUE
```
