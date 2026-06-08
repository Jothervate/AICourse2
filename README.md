# Backend Project

## Run locally

```powershell
npm start
```

Open:

```text
http://localhost:3001/
```

Checkout:

```text
http://localhost:3001/checkout
```

## ECPay staging payment flow

This project uses ECPay staging when:

```env
ECPAY_ENV=staging
```

Normal local flow:

1. Register or log in.
2. Add a product to the cart.
3. Open `/checkout`.
4. Submit the checkout form.
5. The server creates a local order.
6. The browser opens `/payment/redirect/:merchantTradeNo`.
7. The server generates an ECPay checkout form and posts to ECPay staging.
8. ECPay can post browser payment results to `/payment/result`.
9. View local order status at `/payment/result/:merchantTradeNo`.

Staging credit card test data:

```text
Card number: 4311-9522-2222-2222
CVV: 222
Expiry: any MM/YYYY later than the current month
3D SMS code: 1234
Cardholder name: at least 2 characters
Phone: digits only
```

Important routes:

```text
GET  /checkout
POST /api/orders
GET  /payment/redirect/:merchantTradeNo
POST /api/ecpay/return
GET  /payment/result
POST /payment/result
GET  /payment/result/:merchantTradeNo
```

## Environment variables

Copy `.env.example` to `.env` for local development. Do not commit `.env`.

Required ECPay staging variables:

```env
BASE_URL=http://localhost:3001
ECPAY_MERCHANT_ID=3002607
ECPAY_HASH_KEY=pwFHCqoQZGmho4w6
ECPAY_HASH_IV=EkRm7iFT261dpevs
ECPAY_ENV=staging
```

Optional:

```env
ECPAY_RETURN_URL=http://localhost:3001/api/ecpay/return
ECPAY_ORDER_RESULT_URL=http://localhost:3001/payment/result
ECPAY_CLIENT_BACK_URL=http://localhost:3001/payment/result
```

If optional URLs are omitted, they are derived from `BASE_URL`.

## Localhost callback limitation

ECPay cannot call `http://localhost:3001/api/ecpay/return` from the internet. The staging checkout page can open, and browser result posts may reach `/payment/result`, but server-to-server payment notification callbacks require a public HTTPS tunnel.

For full callback testing, use a tunnel and update:

```env
BASE_URL=https://your-public-tunnel-url
ECPAY_RETURN_URL=https://your-public-tunnel-url/api/ecpay/return
ECPAY_ORDER_RESULT_URL=https://your-public-tunnel-url/payment/result
ECPAY_CLIENT_BACK_URL=https://your-public-tunnel-url/payment/result
```

See `docs/ECPAY_INTEGRATION_NOTES.md` for more details.
