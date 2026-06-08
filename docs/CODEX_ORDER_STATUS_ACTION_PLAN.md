# Codex Order Status Action Plan

## Goal

Update the order detail page action buttons based on the current order status.

This task should be a small incremental update.

Do not redesign the page.

Do not modify the ECPay payment integration.

Do not refactor the whole order system.

Only implement the order status button display logic and the basic cancel order behavior.

---

## Current Situation

The project already has:

- Product list
- Cart
- Order detail page
- ECPay payment flow
- Order payment status handling

The order detail page can already show order information.

Now we need to improve the buttons at the bottom of the order detail page.

---

## Required Status Rules

Please inspect the existing order status field first.

The actual field may be named:

```txt
status
payment_status
order_status
```

Use the existing field if possible.

If the project currently uses mixed status names, keep compatibility for existing data, but new canceled orders should use:

```txt
canceled
```

Do not use:

```txt
cancal
```

because that is a spelling error.

---

# Button Display Rules

## 1. Paid Order

When the order status is:

```txt
paid
```

or equivalent paid status, show these buttons:

```txt
返回商店
取消訂單
```

Do not show the payment button.

Expected behavior:

- 「返回商店」 links to the product list page.
- 「取消訂單」 updates the local order status to `canceled`.

---

## 2. Pending / Unpaid Order

When the order status is:

```txt
pending
unpaid
待付款
```

or equivalent unpaid status, show these buttons:

```txt
返回商店
付款
取消訂單
```

Expected behavior:

- 「返回商店」 links to the product list page.
- 「付款」 links to the existing ECPay payment route.
- 「取消訂單」 updates the local order status to `canceled`.

Please inspect the current payment route before implementing the payment button.

Possible payment route examples:

```txt
/payment/redirect/:merchantTradeNo
/orders/:id/pay
/ecpay/checkout/:orderId
```

Use the existing project route.
Do not invent a new payment route unless no route exists.

---

## 3. Failed Payment Order

When the order status is:

```txt
failed
付款失敗
```

or equivalent failed status, show these buttons:

```txt
返回商店
刪除訂單
重新訂購
```

Expected behavior:

- 「返回商店」 links to the product list page.
- 「重新訂購」 links to the product list page or original product page.
- 「刪除訂單」 may delete the local order if a delete route already exists.

If the project does not already have a delete order feature, implement a minimal safe version.

Do not delete related payment logs if they exist.

---

## 4. Canceled Order

When the order status is:

```txt
canceled
cancelled
cancel
取消訂單
```

or equivalent canceled status, show these buttons:

```txt
返回商店
重新訂購
```

Expected behavior:

- 「返回商店」 links to the product list page.
- 「重新訂購」 links to the product list page or original product page.

---

# Cancel Order Behavior

Add or repair the cancel order behavior.

When the user clicks 「取消訂單」:

1. The server should find the order.
2. If the order does not exist, show an error or redirect safely.
3. The server should update the order status to:

```txt
canceled
```

4. The server should redirect back to the order detail page.
5. The order detail page should now show:
   - status: canceled / 取消訂單
   - buttons: 返回商店, 重新訂購

This project does not need a refund flow yet.

Important:

- Do not call ECPay refund API.
- Do not delete paid order data.
- Do not change ECPay payment callback logic.
- Only update the local order status.

---

# Route Requirements

Please inspect current routes first.

If a cancel route already exists, use or repair it.

If no cancel route exists, add a route following the current project style.

Suggested route:

```txt
POST /orders/:id/cancel
```

or, if the project uses order number instead of id:

```txt
POST /orders/:orderNo/cancel
```

The route should:

1. Validate the order exists.
2. Update the status to `canceled`.
3. Redirect back to the order detail page.

If a delete route is needed for failed orders, use the existing project style.

Suggested route:

```txt
POST /orders/:id/delete
```

Only implement delete if it is simple and safe in the current project.

---

# View Requirements

Please find the EJS file for the order detail page.

The button area should use conditional rendering.

Expected logic:

```txt
if order is paid:
  show 返回商店, 取消訂單

else if order is pending / unpaid:
  show 返回商店, 付款, 取消訂單

else if order is failed:
  show 返回商店, 刪除訂單, 重新訂購

else if order is canceled:
  show 返回商店, 重新訂購

else:
  show 返回商店
```

Please avoid hard-coding one fixed button group for all orders.

---

# Link Rules

## 返回商店

Prefer:

```txt
/products
```

If the project uses a different product list route, use the existing route.

## 付款

Use the existing ECPay payment route.

Do not create a duplicate payment flow.

## 重新訂購

Prefer:

```txt
/products
```

If the order contains product id and the project has a product detail page, it may link to that product detail page instead.

## 取消訂單

Use a POST form, not a plain GET link.

Example:

```html
<form method="POST" action="/orders/<%= order.id %>/cancel">
  <button type="submit">取消訂單</button>
</form>
```

Please adapt this example to the actual project route and order id field.

## 刪除訂單

Use a POST form, not a plain GET link.

---

# Status Display

If the order status is `paid`, display:

```txt
已付款
```

If the order status is pending or unpaid, display:

```txt
待付款
```

If the order status is failed, display:

```txt
付款失敗
```

If the order status is canceled, display:

```txt
取消訂單
```

If the current project already has a status label helper, reuse it.

---

# Testing Requirements

After implementation, run:

```bash
npm start
```

Then test the order detail page.

Please verify these cases:

## Case 1: paid

Expected buttons:

```txt
返回商店
取消訂單
```

No payment button.

## Case 2: pending / unpaid

Expected buttons:

```txt
返回商店
付款
取消訂單
```

## Case 3: failed

Expected buttons:

```txt
返回商店
刪除訂單
重新訂購
```

## Case 4: canceled

Expected buttons:

```txt
返回商店
重新訂購
```

## Case 5: cancel order action

Click 「取消訂單」.

Expected result:

1. Order status changes to `canceled`.
2. Page redirects back to the same order detail page.
3. Buttons become:
   - 返回商店
   - 重新訂購

---

# Restrictions

Please do not do these in this task:

- Do not redesign the page.
- Do not create new design files.
- Do not modify ECPay checksum logic.
- Do not modify ECPay callback logic.
- Do not create E2E tests.
- Do not create Skills.
- Do not refactor the whole project.
- Do not change database schema unless absolutely necessary.
- Do not delete existing payment records.

Use the smallest safe change.

---

# Final Report Format

After completing the task, please report:

```txt
Order Status Button Update Summary

1. Files inspected:
2. Files changed:
3. Order status field name:
4. Added or modified routes:
5. Button rules implemented:
6. Cancel order behavior:
7. Test URL:
8. Remaining issues:
```
