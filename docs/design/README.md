# 花漾生活 Design Mockups

## Workflow

No dedicated design MCP tool was available in the current toolset, so this task used the fallback workflow described in `CODEX_DESIGN_GENERATION_PLAN.md`:

1. Inspect current EJS pages and frontend structure.
2. Create a design brief under `docs/design/`.
3. Create local HTML/CSS mockups under `docs/design/mockups/`.
4. Capture desktop and mobile screenshots from the mockups.

Production EJS pages, payment routes, ECPay callback logic, checksum logic, database schema, and order status logic were not modified.

## Mascot Asset

The established guide assistant asset is:

```txt
docs/design/assets/mascot-guide.png
```

Mockups reference this image directly. If the approved production redesign needs to display it in EJS, copy it to:

```txt
public/images/mascot-guide.png
```

Then reference it with:

```txt
/images/mascot-guide.png
```

Usage rules:

- Use as a subtle visual guide only.
- Do not regenerate or replace the character image.
- Do not make it the main content.
- Do not cover product, cart, order, payment, or CTA information.
- Keep the tone premium floral gift shop x Japanese clean elegance.

## Mockup Files

- `mockups/product-list.html`
- `mockups/cart.html`
- `mockups/order-detail.html`
- `mockups/payment-result.html`
- `mockups/mockup.css`

## Screenshot Targets

The required screenshot outputs are:

- `product-list-desktop.png`
- `product-list-mobile.png`
- `cart-desktop.png`
- `cart-mobile.png`
- `order-detail-desktop.png`
- `order-detail-mobile.png`
- `payment-result-desktop.png`
- `payment-result-mobile.png`

## Pages Ready For Implementation

- Product list page
- Cart page
- Order detail page
- Payment result page

## Notes Before EJS/CSS Redesign

- Keep route behavior and payment integrations untouched.
- Apply mascot via `/images/mascot-guide.png` only after copying the existing asset to `public/images/`.
- Preserve existing Vue/EJS data bindings and status conditionals.
- Convert tables to stacked cards on mobile where needed.
- Keep payment buttons visually dominant over decorative elements.
