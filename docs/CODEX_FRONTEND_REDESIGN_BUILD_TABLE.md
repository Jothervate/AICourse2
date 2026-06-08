# Codex Frontend Redesign Build Table

## Goal

Implement the finalized design mockups from `docs/design/` into the existing EJS frontend pages.

This task is for frontend visual implementation only.

Do not modify the ECPay payment logic.

Do not modify CheckMacValue generation or verification.

Do not modify ECPay ReturnURL or ClientBackURL behavior.

Do not refactor the entire project.

---

# Current Design Status

The design direction has been approved.

Design style:

```txt
Premium floral gift shop × Japanese clean elegance
```

Core visual direction:

```txt
Soft luxury
Warm minimal
Elegant floral boutique
Gift-oriented shopping experience
Trustworthy checkout flow
```

The design mockups are located under:

```txt
docs/design/
```

The mascot asset is located at:

```txt
docs/design/assets/mascot-guide.png
```

If the real frontend needs to display the mascot, copy it to:

```txt
public/images/mascot-guide.png
```

Then reference it in EJS as:

```txt
/images/mascot-guide.png
```

---

# Main Implementation Rules

| Rule                 | Requirement                                                                |
| -------------------- | -------------------------------------------------------------------------- |
| Payment logic        | Do not modify ECPay payment flow.                                          |
| CheckMacValue        | Do not modify checksum generation or verification.                         |
| Routes               | Do not change payment routes unless absolutely necessary for visual links. |
| Database             | Do not change database schema.                                             |
| Existing order logic | Preserve paid / pending / failed / canceled status behavior.               |
| UI scope             | Only update layout, styling, responsive behavior, and image usage.         |
| CSS workflow         | Use the existing Tailwind CSS build process.                               |
| Mobile layout        | Must not create horizontal overflow.                                       |

---

# Pages To Implement

| Page                | Design Reference                                                                  | Expected Real Page               | Main Goal                                                                     |
| ------------------- | --------------------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------- |
| Product list page   | `docs/design/product-list-desktop.png`, `docs/design/product-list-mobile.png`     | Existing product list EJS page   | Create a premium floral product browsing experience.                          |
| Cart page           | `docs/design/cart-desktop.png`, `docs/design/cart-mobile.png`                     | Existing cart EJS page           | Create a clean gift checkout cart experience.                                 |
| Order detail page   | `docs/design/order-detail-desktop.png`, `docs/design/order-detail-mobile.png`     | Existing order detail EJS page   | Display order status, recipient info, product details, and available actions. |
| Payment result page | `docs/design/payment-result-desktop.png`, `docs/design/payment-result-mobile.png` | Existing payment result EJS page | Display successful or failed payment result clearly.                          |

---

# Design System

## Colors

Use the approved floral boutique color direction.

| Token        | Suggested Color | Usage                            |
| ------------ | --------------- | -------------------------------- |
| Background   | `#FAF7F2`       | Main page background             |
| Surface      | `#FFFFFF`       | Cards and panels                 |
| Primary      | `#C96F7F`       | Main CTA buttons                 |
| Primary Dark | `#A95666`       | CTA hover state                  |
| Secondary    | `#8A6F5A`       | Muted text / warm accent         |
| Accent Gold  | `#D8B46A`       | Small premium decorative accents |
| Text Main    | `#2F2A27`       | Main headings and important text |
| Text Muted   | `#8C7D75`       | Descriptions and helper text     |
| Success      | `#4F8A6D`       | Paid / success status            |
| Warning      | `#C98B45`       | Pending / warning status         |
| Danger       | `#B85C5C`       | Failed / cancel action           |
| Canceled     | `#9A8F89`       | Canceled status                  |
| Border       | `#E9DED8`       | Card borders and dividers        |

---

# Typography

| Element       | Requirement                         |
| ------------- | ----------------------------------- |
| Main headings | Large, elegant, premium feeling.    |
| Body text     | Clean and readable.                 |
| Labels        | Small, muted, clear.                |
| Prices        | Bold and easy to scan.              |
| Buttons       | Clear, high-contrast, tap-friendly. |

Use the existing font stack if available.
Do not introduce unnecessary external font dependencies unless the project already supports them.

---

# Component Style

| Component     | Requirement                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| Header        | Minimal, elegant, with brand logo and navigation.                           |
| Cards         | White surface, soft border, subtle shadow, rounded corners.                 |
| Product cards | Large image, product name, short description, price, CTA.                   |
| Status badges | Rounded pill style, color based on order status.                            |
| Buttons       | Rounded pill buttons, clear primary / secondary / danger hierarchy.         |
| Tables        | Desktop can use table layout; mobile should become stacked cards if needed. |
| Mascot helper | Small, supportive, not distracting.                                         |

---

# Product List Page Requirements

## Desktop

| Section       | Requirement                                                    |
| ------------- | -------------------------------------------------------------- |
| Hero          | Large floral hero with premium headline and short description. |
| Hero images   | Use floral product images in a polished layout.                |
| Mascot helper | Place as a small guide card inside or near hero.               |
| Product grid  | 4-column or responsive grid depending on available width.      |
| Product card  | Image, name, description, price, add-to-cart button.           |

## Mobile

| Requirement                            |
| -------------------------------------- |
| Hero must become single-column.        |
| Text must not be clipped.              |
| Images must fit within viewport.       |
| Product cards should stack vertically. |
| Buttons should be easy to tap.         |
| No horizontal scrolling.               |

---

# Cart Page Requirements

The cart design mockup shows both a filled cart and an empty cart reference.

In the real page, do not show both at the same time.

| Cart State     | Required UI                                                             |
| -------------- | ----------------------------------------------------------------------- |
| Cart has items | Show cart item list, quantity controls, order summary, checkout button. |
| Cart is empty  | Show empty cart state, mascot helper, and return-to-products button.    |

## Cart Item UI

Each item should show:

```txt
Product image
Product name
Product short description
Quantity controls
Item price
Remove action
```

## Order Summary UI

Show:

```txt
Product subtotal
Shipping fee
Gift packaging status
Total amount
Checkout button
Mascot checkout reminder
```

---

# Order Detail Page Requirements

The mockup includes a right-side status rule table for design explanation.

Do not include this debug / reference table in the real user-facing UI.

The real order detail page should only show the current available actions for the current order.

## Required Sections

| Section                    | Requirement                                            |
| -------------------------- | ------------------------------------------------------ |
| Order header               | Order number, created date, status badge.              |
| Recipient information      | Name, email, address.                                  |
| Payment status explanation | Short helper text based on current status.             |
| Product details            | Product name, unit price, quantity, subtotal.          |
| Order total                | Clear total amount.                                    |
| Action panel               | Only show valid actions based on current order status. |

## Order Status Labels

| Raw Status                          | Display Label |
| ----------------------------------- | ------------- |
| `paid`                              | 已付款        |
| `pending` / `unpaid`                | 待付款        |
| `failed`                            | 付款失敗      |
| `canceled` / `cancelled` / `cancel` | 取消訂單      |

## Order Action Buttons

| Status               | Buttons                      |
| -------------------- | ---------------------------- |
| `paid`               | 返回商店, 取消訂單           |
| `pending` / `unpaid` | 返回商店, 付款, 取消訂單     |
| `failed`             | 返回商店, 刪除訂單, 重新訂購 |
| `canceled`           | 返回商店, 重新訂購           |

Important:

Do not break the existing cancel order behavior.
Do not break the existing payment redirect behavior.
Use the current project routes.

---

# Payment Result Page Requirements

Implement both success and failed states based on the existing payment result data.

## Success State

Show:

```txt
Payment success badge
Large success headline
Order number
Payment amount
Payment method
ECPay trade number if available
Next steps
View order button
Return to shop button
Mascot image
```

Suggested success message:

```txt
你的花禮訂單已完成付款。
```

Suggested helper text:

```txt
我們會開始整理花材與包裝，並依照訂單資訊安排後續出貨。
```

## Failed State

Show:

```txt
Payment failed / incomplete badge
Failure headline
Retry payment button
View order button
Mascot image
```

Suggested failed message:

```txt
付款尚未完成，請確認後再試一次。
```

---

# Mascot Usage

Use the mascot as a subtle visual helper.

| Page           | Usage                                         |
| -------------- | --------------------------------------------- |
| Product list   | Small guide card in hero area.                |
| Cart           | Checkout reminder or empty cart illustration. |
| Order detail   | Status helper card.                           |
| Payment result | Celebration or reassurance illustration.      |

Rules:

```txt
Do not let the mascot block important content.
Do not overuse it.
Do not make it larger than the main content.
On mobile, reduce mascot size.
Use proper alt text.
```

Suggested alt text:

```txt
花漾生活畫面引導小助手
```

---

# Responsive Requirements

Test at these viewport widths:

```txt
390px mobile
768px tablet
1280px desktop
```

## Mobile Rules

| Requirement                                                  |
| ------------------------------------------------------------ |
| No horizontal scrolling.                                     |
| All main sections should be single-column.                   |
| Cards must not exceed viewport width.                        |
| Large headings must wrap safely.                             |
| Buttons may become full width.                               |
| Product detail tables should become stacked cards if needed. |
| Mascot image should be smaller.                              |
| Header navigation should remain readable.                    |

Recommended CSS safety rules:

```css
* {
  box-sizing: border-box;
}

html,
body {
  max-width: 100%;
  overflow-x: hidden;
}

img {
  max-width: 100%;
  height: auto;
}

.container,
.card,
.panel,
.hero,
.summary {
  max-width: 100%;
}
```

---

# Implementation Checklist

| Step | Task                                                             | Done |
| ---- | ---------------------------------------------------------------- | ---- |
| 1    | Inspect existing EJS views.                                      |      |
| 2    | Identify product list view.                                      |      |
| 3    | Identify cart view.                                              |      |
| 4    | Identify order detail view.                                      |      |
| 5    | Identify payment result view.                                    |      |
| 6    | Inspect current CSS / Tailwind input file.                       |      |
| 7    | Copy mascot image to `public/images/mascot-guide.png` if needed. |      |
| 8    | Implement product list page style.                               |      |
| 9    | Implement cart page style.                                       |      |
| 10   | Implement conditional cart empty / filled state.                 |      |
| 11   | Implement order detail page style.                               |      |
| 12   | Preserve existing order status action logic.                     |      |
| 13   | Implement payment result page style.                             |      |
| 14   | Verify mobile layout has no horizontal overflow.                 |      |
| 15   | Run CSS build.                                                   |      |
| 16   | Run `npm start`.                                                 |      |
| 17   | Report test URLs.                                                |      |

---

# Verification Checklist

| Check                       | Expected Result                                |
| --------------------------- | ---------------------------------------------- |
| Product list page loads     | Page matches floral boutique design direction. |
| Cart with products loads    | Shows cart items and order summary.            |
| Empty cart state works      | Shows only empty cart UI.                      |
| Order detail paid state     | Shows paid badge and correct buttons.          |
| Order detail pending state  | Shows pending badge and payment button.        |
| Order detail failed state   | Shows failed state actions.                    |
| Order detail canceled state | Shows reorder action.                          |
| Payment success page        | Shows success result clearly.                  |
| Payment failed page         | Shows failed result clearly.                   |
| Mobile 390px                | No horizontal scrolling or clipped text.       |
| Desktop 1280px              | Layout matches approved mockups.               |
| ECPay flow                  | Existing payment flow is not modified.         |

---

# Important Restrictions

Do not do the following:

```txt
Do not modify ECPay checksum logic.
Do not modify ECPay callback logic.
Do not modify payment status update logic.
Do not modify database schema.
Do not replace the whole project structure.
Do not display the design-only status rule table in the real order detail page.
Do not show filled cart and empty cart UI at the same time.
Do not create E2E tests in this task.
Do not create or modify Challenge 2 Skill in this task.
```

---

# Required Final Report

After completing the implementation, report:

```txt
Frontend Redesign Implementation Summary

1. Files inspected:
2. Files changed:
3. EJS pages updated:
4. CSS files updated:
5. Mascot image usage:
6. Responsive checks completed:
7. Local URLs for review:
8. Confirmation that ECPay logic was not modified:
9. Remaining issues:
```
