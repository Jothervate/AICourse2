# Codex ECPay Integration Plan

## Goal

Complete or repair the ECPay payment integration in this existing Node.js / Express project.

The goal is to make the project support a working ECPay staging payment flow:

```txt
Product / checkout page
→ Create local order
→ Generate ECPay AIO checkout form
→ Submit to ECPay staging payment page
→ Receive payment result callback
→ Update local order status
→ Show payment result page
```

Do not redesign the frontend yet.

Do not create the Design Skill yet.

Do not create the E2E Skill yet.

This task is only for completing and verifying the ECPay payment flow.

---

## Current Project Context

This is a Node.js / Express backend project using:

- Express
- EJS
- SQLite / better-sqlite3
- Tailwind CSS
- dotenv
- JWT
- ECPay staging environment

The project already has a `.env` file with:

```env
# JWT
JWT_SECRET=dev_secret_for_local_test

# Server
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

# Admin Seed Data
ADMIN_EMAIL=admin@hexschool.com
ADMIN_PASSWORD=12345678

# ECPay
ECPAY_MERCHANT_ID=3002607
ECPAY_HASH_KEY=pwFHCqoQZGmho4w6
ECPAY_HASH_IV=EkRm7iFT261dpevs
ECPAY_ENV=staging
```

Important:

- Do not commit `.env`.
- Do not expose production secrets.
- Use ECPay staging/test environment only.
- If additional environment variables are required, document them in `.env.example`.

---

## Required ECPay Behavior

The integration should support this normal flow:

1. User opens product or checkout page.
2. User submits order information.
3. Server creates a local order record.
4. Server generates ECPay checkout parameters.
5. Server generates `CheckMacValue`.
6. Server returns or renders an auto-submit HTML form.
7. Browser is redirected to ECPay staging checkout page.
8. ECPay sends payment result notification to `ReturnURL`.
9. Server verifies the returned `CheckMacValue`.
10. Server updates the local order payment status.
11. User can view payment result page.

---

## Technical Requirements

### 1. Environment Variables

Use these variables:

```env
BASE_URL=http://localhost:3001
ECPAY_MERCHANT_ID=3002607
ECPAY_HASH_KEY=pwFHCqoQZGmho4w6
ECPAY_HASH_IV=EkRm7iFT261dpevs
ECPAY_ENV=staging
```

If needed, add:

```env
ECPAY_RETURN_URL=http://localhost:3001/api/ecpay/return
ECPAY_CLIENT_BACK_URL=http://localhost:3001/payment/result
```

If these are not present, derive them from `BASE_URL`.

---

### 2. ECPay Endpoint

Use staging endpoint when `ECPAY_ENV=staging`.

The project should clearly separate staging and production endpoint configuration.

Expected behavior:

```js
const ECPAY_CHECKOUT_URL =
  process.env.ECPAY_ENV === "production"
    ? "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
    : "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
```

If the current project already defines this elsewhere, inspect and preserve it unless it is incorrect.

---

### 3. Required Checkout Parameters

Generate ECPay AIO checkout parameters similar to:

```js
{
  MerchantID,
  MerchantTradeNo,
  MerchantTradeDate,
  PaymentType: "aio",
  TotalAmount,
  TradeDesc,
  ItemName,
  ReturnURL,
  ChoosePayment: "ALL",
  ClientBackURL,
  EncryptType: 1
}
```

Rules:

- `MerchantTradeNo` must be unique.
- `MerchantTradeNo` must satisfy ECPay format restrictions.
- `MerchantTradeDate` should use `yyyy/MM/dd HH:mm:ss`.
- `TotalAmount` should be an integer.
- `ItemName` should be readable and valid for ECPay.
- Do not include `CheckMacValue` when calculating `CheckMacValue`.
- Add `CheckMacValue` only after calculation.

---

### 4. CheckMacValue

Implement CheckMacValue generation according to ECPay's official checksum mechanism.

Important rules:

1. Exclude `CheckMacValue` itself from the calculation.
2. Sort parameters alphabetically by key.
3. Create query string format.
4. Add `HashKey` before the string and `HashIV` after the string.
5. URL encode according to ECPay rules.
6. Convert to lowercase if required by the official rule.
7. Hash with SHA256.
8. Convert final result to uppercase.

Create a utility function, for example:

```js
generateCheckMacValue(params);
```

Also create a verification function:

```js
verifyCheckMacValue(receivedParams);
```

The verification function should:

- Extract received `CheckMacValue`
- Recalculate CheckMacValue from the other fields
- Compare both values safely
- Return true or false

If the current project already has these functions, inspect and fix them rather than duplicating logic.

---

### 5. Local Order Record

Inspect the current database schema.

If an orders table already exists, use it.

If not, create a minimal local order persistence layer.

Required order fields:

- id
- merchant_trade_no
- product_name
- total_amount
- buyer_name
- buyer_email
- payment_status
- ecpay_trade_no
- ecpay_rtn_code
- ecpay_rtn_msg
- created_at
- paid_at

Suggested payment statuses:

```txt
pending
paid
failed
unknown
```

Do not make unnecessary schema changes if an existing order schema already works.

---

### 6. Express Routes

Create or repair these routes if needed:

```txt
GET  /checkout
POST /api/orders
GET  /payment/redirect/:merchantTradeNo
POST /api/ecpay/return
GET  /payment/result
GET  /payment/result/:merchantTradeNo
```

Route behavior:

### `GET /checkout`

Render checkout page or return current checkout UI.

### `POST /api/orders`

Create a local order.

Accept fields such as:

```json
{
  "productName": "前端工程師實戰入門課",
  "amount": 1280,
  "buyerName": "測試使用者",
  "buyerEmail": "test@example.com"
}
```

Return created order information and next payment URL.

### `GET /payment/redirect/:merchantTradeNo`

Find local order.

Generate ECPay checkout params.

Render an auto-submit HTML form to ECPay staging checkout endpoint.

### `POST /api/ecpay/return`

Receive ECPay payment result notification.

Verify `CheckMacValue`.

Update local order status.

Return the exact response expected by ECPay after successful processing.

If verification fails, reject or log the invalid callback safely.

### `GET /payment/result/:merchantTradeNo`

Render a local payment result page showing:

- order number
- amount
- payment status
- ECPay trade number if available
- result message

---

## Security Requirements

- Never expose `HashKey` or `HashIV` to frontend JavaScript.
- Never commit `.env`.
- Add or update `.env.example`.
- Use staging credentials only.
- Validate order amount server-side.
- Do not trust frontend-submitted payment status.
- Verify ECPay callback CheckMacValue.
- Avoid logging full secret values.

---

## UI Requirements for This Task

Keep UI simple.

This task is not the redesign assignment yet.

The UI only needs to allow testing the payment flow.

Minimum UI pages:

1. Checkout page
2. Auto-redirect payment form page
3. Payment result page

Do not spend time making the UI beautiful yet.

---

## Testing Requirements

After implementation, run:

```bash
npm start
```

Then manually verify:

1. Open the local checkout URL.
2. Create an order.
3. Confirm local order is saved.
4. Click or auto-submit to ECPay staging payment page.
5. Confirm ECPay page opens.
6. Use ECPay test payment flow or staging simulation if available.
7. Confirm `ReturnURL` receives payment notification if the local server is publicly reachable.
8. Confirm payment result page shows correct order status.

If local `ReturnURL` cannot be reached by ECPay because the server is running on localhost, document that limitation and suggest using ngrok or another tunnel.

---

## Localhost Callback Limitation

ECPay cannot call a private localhost URL from the internet.

If `BASE_URL=http://localhost:3001`, the browser redirect can work, but server-to-server `ReturnURL` from ECPay may not reach the local machine.

If full callback testing is required, use a public HTTPS tunnel such as ngrok and update:

```env
BASE_URL=https://your-public-tunnel-url
ECPAY_RETURN_URL=https://your-public-tunnel-url/api/ecpay/return
ECPAY_CLIENT_BACK_URL=https://your-public-tunnel-url/payment/result
```

Document this clearly.

---

## Documentation Requirements

Update or create:

```txt
docs/ECPAY_INTEGRATION_NOTES.md
.env.example
README.md
```

The documentation should explain:

- How to start the project
- Required environment variables
- ECPay staging mode
- Checkout flow
- Localhost callback limitation
- How to test with tunnel if needed
- Important routes
- Known limitations

---

## Restrictions

Do not do these yet:

- Do not redesign the UI.
- Do not create design screenshots.
- Do not create the Design Skill.
- Do not create the E2E Skill.
- Do not add Playwright tests yet.
- Do not remove existing ECPay logic without explaining why.
- Do not replace the whole project.
- Do not expose production secrets.

---

## Final Response Format

After completing the task, summarize:

```txt
ECPay Integration Summary

1. Root cause or current state:
2. Files inspected:
3. Files changed:
4. Routes added or fixed:
5. Environment variables required:
6. Commands run:
7. Local test URL:
8. ECPay staging redirect result:
9. Callback limitation, if any:
10. Remaining issues:
```
