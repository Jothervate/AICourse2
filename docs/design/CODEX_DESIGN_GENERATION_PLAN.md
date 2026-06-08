# Codex Design Generation Plan

## Goal

Generate a new design direction and design mockups for the existing floral e-commerce project「花漾生活」.

This project already has an ECPay payment flow.
The current task is only about design generation and frontend redesign planning.

Do not modify the ECPay payment logic yet.

The goal is to create a polished design foundation for Challenge 1:

```txt
Design Skill
→ Design mockups
→ Save design assets to ./docs/design/
→ Later implement the frontend based on the design
```

---

# Project Context

The existing project is a floral e-commerce website called:

```txt
花漾生活
```

The project currently includes:

- Product list
- Cart
- My orders
- Order detail page
- ECPay payment flow
- Payment status handling
- Order actions such as payment, cancellation, and reordering

The redesign should preserve the existing shopping and payment flow.

---

# Design Style

Use a mixed style:

```txt
Premium floral gift shop × Japanese clean elegance
```

The visual direction should feel:

- Elegant
- Warm
- Soft luxury
- Trustworthy
- Clean
- Gift-oriented
- Suitable for checkout and payment
- More like a real boutique floral brand than a student demo

Avoid:

- Generic Bootstrap appearance
- Overly plain white cards
- Cheap-looking e-commerce style
- Too much visual noise
- Childish colors
- Overly dark luxury style
- Breaking existing payment flow

---

# Brand Keywords

Use these keywords as the design foundation:

```txt
Floral Living
Premium Floral Gift
Soft Luxury
Warm Minimal
Japanese Floral Boutique
Elegant Checkout
Gift Ceremony
```

Chinese concept:

```txt
高級花禮
日系清雅
溫柔精品
送禮儀式感
安心付款體驗
```

---

# Color Palette

Use a soft floral boutique palette.

Suggested colors:

```txt
Background: #FAF7F2
Surface: #FFFFFF
Primary: #C96F7F
Primary Dark: #A95666
Secondary: #8A6F5A
Accent Gold: #D8B46A
Text Main: #2F2A27
Text Muted: #8C7D75
Success: #4F8A6D
Warning: #C98B45
Danger: #B85C5C
Canceled: #9A8F89
Border: #E9DED8
```

The final design does not need to use these exact values, but should stay close to this feeling.

---

# Typography Direction

Use a refined typography style.

Suggested feeling:

- Elegant serif or semi-serif for major headings
- Clean sans-serif for body text
- Good readability
- Calm spacing
- Clear hierarchy

Headings should feel like a premium floral brand.

Body text should remain readable and practical for checkout pages.

---

# Mascot / Guide Assistant

Add an original chibi-style guide assistant as a small visual identity element.

This mascot should be original and should not resemble any existing copyrighted character.

Mascot concept:

```txt
花漾生活畫面引導小助手
```

Role:

- A friendly on-screen guide
- Helps users understand product, cart, order, and payment states
- Adds memorability to the website
- Should support the shopping experience without distracting from checkout

Visual style:

- Chibi / SD style
- Cute but polished
- Floral boutique theme
- Pastel mint, cream, dusty rose, and warm gold
- Soft Japanese-inspired illustration style
- Friendly expression
- Small signboard or pointing gesture
- Suitable as a floating helper, empty-state illustration, or payment-success guide

Usage rules:

- Do not place the mascot everywhere.
- Do not let it block important checkout content.
- Use it only as a subtle guide or visual accent.
- It should appear mainly in:
  - Product list hero area
  - Cart helper message
  - Order detail status hint
  - Payment success page

Suggested mascot messages:

```txt
商品列表頁：挑一份最適合送禮的花禮吧！
購物車頁：確認商品後，就可以前往結帳囉。
訂單詳情頁：這裡可以查看付款狀態與訂單資訊。
付款完成頁：付款完成，花禮準備出發！
```

If there is already a mascot image asset, place it under:

```txt
docs/design/mascot-guide.png
```

and use it as a design reference.

---

# Required Design Mockup Pages

Create design mockups for these pages:

## 1. Product List Page

Purpose:

- Show floral products
- Present the brand feeling
- Encourage users to add items to cart

Design requirements:

- Elegant hero section
- Product cards with soft shadows and rounded corners
- Clear product image area
- Product name, price, and CTA
- Mascot guide can appear in hero or helper area
- Desktop and mobile responsive layout

---

## 2. Cart Page

Purpose:

- Let users review selected products before checkout

Design requirements:

- Clear cart item list
- Quantity and price display
- Order summary card
- Checkout CTA
- Empty cart state if possible
- Mascot can appear as a small helper near the summary or empty state

---

## 3. Order Detail Page

Purpose:

- Show order status and order details
- Support different order actions based on status

Design requirements:

- Clear order number and date
- Status badge
- Receiver information card
- Product detail table/card
- Total amount display
- Action buttons based on status
- Mascot can appear as a small status helper, not the main focus

Order status display:

```txt
paid → 已付款
pending / unpaid → 待付款
failed → 付款失敗
canceled → 取消訂單
```

Button rules:

```txt
paid:
- 返回商店
- 取消訂單

pending / unpaid:
- 返回商店
- 付款
- 取消訂單

failed:
- 返回商店
- 刪除訂單
- 重新訂購

canceled:
- 返回商店
- 重新訂購
```

---

## 4. Payment Success / Payment Result Page

Purpose:

- Show payment result after ECPay flow

Design requirements:

- Clear success state
- Order number
- Payment amount
- Payment method if available
- Next steps
- Return to shop CTA
- Mascot should appear here as a celebratory helper

For success:

```txt
付款完成，花禮準備出發！
```

For failed:

```txt
付款未完成，請重新確認付款資訊。
```

---

# Responsive Requirements

Create both desktop and mobile design references.

Desktop:

- Max-width content container
- Strong horizontal spacing
- Cards and summary panels
- Premium brand feeling

Mobile:

- Single-column layout
- Buttons should be easy to tap
- Product cards should stack cleanly
- Order detail table can become stacked cards
- Mascot should be smaller and not block content

---

# Design Deliverables

Create or update this folder:

```txt
docs/design/
```

Required files:

```txt
docs/design/README.md
docs/design/design-brief.md
docs/design/product-list-desktop.png
docs/design/product-list-mobile.png
docs/design/cart-desktop.png
docs/design/cart-mobile.png
docs/design/order-detail-desktop.png
docs/design/order-detail-mobile.png
docs/design/payment-result-desktop.png
docs/design/payment-result-mobile.png
```

If direct image export is not available, create local HTML mockup files first:

```txt
docs/design/mockups/product-list.html
docs/design/mockups/cart.html
docs/design/mockups/order-detail.html
docs/design/mockups/payment-result.html
```

Then capture screenshots from those mockups and save them under `docs/design/`.

---

# Design Tool Requirement

If a design MCP tool is available, use it.

Preferred tools:

```txt
Figma MCP
Google Stitch
Pencil
Other available design MCP tools
```

If no design MCP tool is available, use the fallback workflow:

```txt
Design Skill
→ design-brief.md
→ HTML/CSS mockups
→ screenshots saved to docs/design/
```

Clearly document which workflow was used in:

```txt
docs/design/README.md
```

---

# Important Restrictions

Do not do the following during this task:

- Do not modify ECPay checksum logic.
- Do not modify ECPay callback logic.
- Do not modify payment routes.
- Do not change database schema.
- Do not break login, cart, order, or payment behavior.
- Do not remove existing order status logic.
- Do not implement E2E tests yet.
- Do not create Challenge 2 Skill yet.
- Do not make the mascot the main content of every page.

This task is about generating the design foundation first.

---

# Suggested Workflow

Please follow this sequence:

1. Inspect the current project structure.
2. Identify the EJS views and CSS files related to:
   - product list
   - cart
   - order detail
   - payment result

3. Create or update the design documentation.
4. Generate design mockups.
5. Save mockup screenshots or mockup files under `docs/design/`.
6. Report which pages are ready for implementation.
7. Do not modify production views unless explicitly requested after design approval.

---

# Final Report Format

After completing the design generation task, report:

```txt
Design Generation Summary

1. Design direction:
2. Design tool or workflow used:
3. Files created:
4. Mockup pages created:
5. Mascot usage:
6. Screenshots saved:
7. Pages ready for frontend implementation:
8. Notes before starting actual EJS/CSS redesign:
```
