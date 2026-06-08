# Codex Frontend Animation Plan

## Goal

Add subtle, elegant frontend animations to the redesigned floral e-commerce pages.

This task is only for visual interaction polish.

Do not modify ECPay payment logic.

Do not modify CheckMacValue generation or verification.

Do not modify ECPay ReturnURL or ClientBackURL behavior.

Do not modify database schema.

Do not refactor the project.

---

# Design Direction

The current approved style is:

```txt
Premium floral gift shop × Japanese clean elegance
```

Animations should support this feeling:

```txt
Soft luxury
Warm minimal
Elegant
Calm
Trustworthy
Premium floral boutique
```

The animation style should be subtle and refined, not flashy.

---

# Animation Principles

| Principle               | Requirement                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| Subtle                  | Animations should be soft and not distracting.                             |
| Fast enough             | Most transitions should be between 180ms and 500ms.                        |
| Premium feeling         | Use gentle opacity, translateY, scale, shadow, and easing.                 |
| Accessible              | Support `prefers-reduced-motion`.                                          |
| Safe                    | Do not affect payment forms, order submission, or ECPay redirect behavior. |
| Progressive enhancement | The website must still work if JavaScript animations fail.                 |

---

# Required Animation Effects

## 1. Page Entrance Fade-In

When a page loads, the main content should softly appear.

Suggested effect:

```txt
opacity: 0 → 1
translateY: 12px → 0
duration: 450ms
easing: ease-out
```

Apply to:

```txt
main page container
hero section
major content cards
```

Do not delay important payment buttons too much.

---

## 2. Scroll Reveal Animation

When major sections enter the viewport, they should fade in and move slightly upward.

Use Intersection Observer if JavaScript is already acceptable in the project.

Suggested class names:

```txt
.js-reveal
.is-visible
```

Suggested behavior:

```txt
Initial:
opacity: 0
transform: translateY(18px)

Visible:
opacity: 1
transform: translateY(0)
```

Apply to:

```txt
product cards
cart summary
order detail cards
payment result panels
mascot helper cards
```

Do not apply to every tiny text element.

---

## 3. Product Card Hover Animation

Product cards should have a gentle hover effect on desktop.

Suggested effect:

```txt
transform: translateY(-4px)
box-shadow becomes slightly stronger
image scale: 1 → 1.03
duration: 220ms
```

Mobile should not rely on hover.

---

## 4. Button Hover and Active Animation

Buttons should feel polished.

Suggested effects:

```txt
hover:
transform: translateY(-1px)
background color slightly darkens
box-shadow slightly increases

active:
transform: translateY(0)
scale: 0.98
```

Apply to:

```txt
Add to cart
Checkout
Pay
Return to shop
View order
Retry payment
Cancel order
Reorder
```

Danger actions should remain visually clear and not playful.

---

## 5. Mascot Helper Floating Animation

The mascot image can have a very gentle floating animation.

Suggested effect:

```txt
translateY(0) → translateY(-6px) → translateY(0)
duration: 4s
easing: ease-in-out
iteration: infinite
```

Apply only to mascot image wrappers, not to the entire page.

Class suggestion:

```txt
.mascot-float
```

Important:

```txt
Do not make the mascot move too much.
Do not let the mascot distract from checkout or payment actions.
Disable this animation when prefers-reduced-motion is enabled.
```

---

## 6. Status Badge Transition

Order status badges should appear cleanly.

Suggested effect:

```txt
opacity fade-in
small scale from 0.96 to 1
duration: 220ms
```

Apply to statuses:

```txt
paid
pending
failed
canceled
```

Do not change existing order status logic.

---

## 7. Payment Result Emphasis

On the payment result page, the result card should appear with a slightly more noticeable entrance.

Success state:

```txt
fade in
translateY from 16px to 0
small scale from 0.98 to 1
```

Failed state:

```txt
fade in
translateY from 12px to 0
```

Do not create confetti or heavy effects.

This is a premium floral brand, not a game UI.

---

## 8. Cart Item Update Animation

If the existing cart quantity controls update the DOM without full reload, add a subtle transition.

Suggested effect:

```txt
price / quantity area briefly fades or highlights
duration: 200ms
```

If the cart currently reloads the page after quantity change, do not add complex JavaScript just for this.

Keep it simple.

---

# Accessibility Requirements

## prefers-reduced-motion

Add a reduced motion rule:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

Users who prefer reduced motion should not receive floating or scroll reveal animations.

---

# Suggested CSS Classes

Use or adapt these class names:

```txt
.page-enter
.reveal
.reveal-visible
.card-hover
.button-motion
.mascot-float
.status-badge-motion
.payment-result-enter
```

If the project already has a naming convention, follow the existing convention instead.

---

# Suggested CSS Implementation

Add animation utilities to the existing Tailwind input CSS file or the current global CSS file.

Do not edit generated CSS directly if the project uses Tailwind output generation.

Preferred location:

```txt
public/css/input.css
```

Do not manually edit:

```txt
public/css/output.css
```

unless the project currently uses it as the source file.

---

# Suggested JavaScript Implementation

If scroll reveal is implemented, create a small frontend JavaScript file only if the project already supports static JS files.

Possible file:

```txt
public/js/reveal.js
```

Suggested behavior:

1. Select all elements with `[data-reveal]`.
2. Use Intersection Observer.
3. Add `is-visible` when the element enters the viewport.
4. If Intersection Observer is not supported, show all elements immediately.
5. Respect `prefers-reduced-motion`.

Do not add a heavy animation library.

Do not install Framer Motion, GSAP, or other large dependencies for this task.

---

# Page-by-Page Animation Requirements

## Product List Page

| Element            | Animation                       |
| ------------------ | ------------------------------- |
| Hero section       | Page entrance fade-in           |
| Product cards      | Scroll reveal + desktop hover   |
| Mascot helper      | Gentle floating animation       |
| Add to cart button | Button hover / active animation |

---

## Cart Page

| Element          | Animation                       |
| ---------------- | ------------------------------- |
| Cart panel       | Page entrance fade-in           |
| Cart items       | Scroll reveal                   |
| Order summary    | Slight delayed reveal           |
| Checkout button  | Button hover / active animation |
| Empty cart state | Soft fade-in                    |

Important:

Do not show filled cart and empty cart at the same time.

---

## Order Detail Page

| Element                         | Animation             |
| ------------------------------- | --------------------- |
| Order header card               | Page entrance fade-in |
| Recipient info card             | Scroll reveal         |
| Payment status explanation card | Scroll reveal         |
| Product detail card             | Scroll reveal         |
| Action panel                    | Scroll reveal         |
| Status badge                    | Badge fade / scale    |

Important:

Do not modify existing order status button logic.

---

## Payment Result Page

| Element                 | Animation                       |
| ----------------------- | ------------------------------- |
| Payment result card     | Slightly emphasized entrance    |
| Success or failed badge | Badge fade / scale              |
| Detail rows             | Soft reveal                     |
| Mascot                  | Gentle floating animation       |
| CTA buttons             | Button hover / active animation |

---

# Mobile Rules

Animations on mobile should be lighter.

| Requirement                                                                |
| -------------------------------------------------------------------------- |
| Do not cause horizontal scrolling.                                         |
| Do not animate large elements in a way that shifts layout after page load. |
| Do not delay important buttons.                                            |
| Mascot floating should be very subtle or disabled if it feels distracting. |
| All content must remain readable while animations load.                    |

---

# Performance Rules

Do:

```txt
Use opacity and transform.
Use CSS transitions.
Use Intersection Observer.
Keep JavaScript small.
```

Avoid:

```txt
Animating width, height, top, left, margin, or layout-heavy properties.
Adding heavy dependencies.
Using infinite animations on many elements.
Blocking page rendering.
```

---

# Important Restrictions

Do not do the following:

```txt
Do not modify ECPay payment logic.
Do not modify CheckMacValue.
Do not modify ReturnURL or ClientBackURL behavior.
Do not change database schema.
Do not change order status update logic.
Do not break checkout form submission.
Do not block payment redirect with animations.
Do not add heavy animation libraries.
Do not make the mascot overly animated.
```

---

# Implementation Checklist

| Step | Task                                                    | Done |
| ---- | ------------------------------------------------------- | ---- |
| 1    | Inspect current CSS source file.                        |      |
| 2    | Identify whether global frontend JS already exists.     |      |
| 3    | Add animation utility classes.                          |      |
| 4    | Add `prefers-reduced-motion` support.                   |      |
| 5    | Add scroll reveal JavaScript if appropriate.            |      |
| 6    | Apply reveal attributes/classes to major sections only. |      |
| 7    | Add product card hover effects.                         |      |
| 8    | Add button hover / active effects.                      |      |
| 9    | Add mascot floating animation.                          |      |
| 10   | Add payment result entrance animation.                  |      |
| 11   | Run CSS build.                                          |      |
| 12   | Run `npm start`.                                        |      |
| 13   | Verify pages visually.                                  |      |
| 14   | Verify mobile has no horizontal overflow.               |      |
| 15   | Confirm payment flow is unchanged.                      |      |

---

# Verification Checklist

| Check               | Expected Result                            |
| ------------------- | ------------------------------------------ |
| Product list page   | Hero and cards fade in smoothly.           |
| Product cards       | Desktop hover feels subtle and premium.    |
| Cart page           | Cart and summary appear cleanly.           |
| Empty cart          | Empty state fades in without layout jump.  |
| Order detail page   | Cards reveal softly.                       |
| Status badge        | Badge appears smoothly.                    |
| Payment result page | Result card has elegant entrance.          |
| Mascot              | Floats subtly and does not distract.       |
| Mobile 390px        | No clipped content or horizontal scroll.   |
| Reduced motion      | Animations are disabled or nearly instant. |
| ECPay flow          | Payment behavior remains unchanged.        |

---

# Final Report Format

After completing the task, report:

```txt
Frontend Animation Implementation Summary

1. Files inspected:
2. Files changed:
3. CSS animation classes added:
4. JavaScript added or modified:
5. Pages updated:
6. Reduced motion support:
7. Mobile responsive check:
8. Confirmation that ECPay logic was not modified:
9. Remaining issues:
```
