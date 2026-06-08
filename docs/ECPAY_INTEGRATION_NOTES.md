# ECPay Staging Integration Notes

## Start the project

```powershell
npm start
```

Open:

```text
http://localhost:3001/
```

Checkout page:

```text
http://localhost:3001/checkout
```

## Required environment variables

The local `.env` should contain staging values:

```env
BASE_URL=http://localhost:3001
ECPAY_MERCHANT_ID=3002607
ECPAY_HASH_KEY=pwFHCqoQZGmho4w6
ECPAY_HASH_IV=EkRm7iFT261dpevs
ECPAY_ENV=staging
```

Optional overrides:

```env
ECPAY_RETURN_URL=http://localhost:3001/api/ecpay/return
ECPAY_ORDER_RESULT_URL=http://localhost:3001/payment/result
ECPAY_CLIENT_BACK_URL=http://localhost:3001/payment/result
```

If optional values are omitted, the app derives them from `BASE_URL`.

## Local test flow

1. Register or log in.
2. Add a product to the cart.
3. Open `http://localhost:3001/checkout`.
4. Submit recipient name, email, and address.
5. The app creates a local order.
6. The browser opens `/payment/redirect/:merchantTradeNo`.
7. The server generates ECPay checkout parameters and `CheckMacValue`.
8. The auto-submit form posts to ECPay staging:

```text
https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5
```

9. Use the ECPay staging checkout page to continue payment testing.
   The checkout form uses credit card payment directly for staging tests.

   Official ECPay staging credit card test data:

```text
Card number: 4311-9522-2222-2222
CVV: 222
Expiry: any MM/YYYY later than the current month
3D SMS code: 1234
Cardholder name: at least 2 characters
Phone: digits only
```

10. ECPay can post browser payment results to:

```text
http://localhost:3001/payment/result
```

11. You can also open the local result page directly:

```text
http://localhost:3001/payment/result/:merchantTradeNo
```

## Important routes

```text
GET  /checkout
POST /api/orders
GET  /payment/redirect/:merchantTradeNo
POST /api/ecpay/return
GET  /payment/result
POST /payment/result
GET  /payment/result/:merchantTradeNo
```

## Callback verification

`POST /api/ecpay/return` and `POST /payment/result` verify the received `CheckMacValue` before updating the order.

Successful verified callbacks update:

- `orders.status`
- `orders.ecpay_trade_no`
- `orders.ecpay_rtn_code`
- `orders.ecpay_rtn_msg`
- `orders.paid_at`

The route returns:

```text
1|OK
```

## Localhost callback limitation

ECPay cannot send the server-to-server `ReturnURL` notification to a private localhost URL.

The browser redirect to ECPay staging can work from localhost. `OrderResultURL` may update the local database through the user's browser, but the server-to-server `ReturnURL` still requires a public HTTPS tunnel such as ngrok.

Example tunnel configuration:

```env
BASE_URL=https://your-public-tunnel-url
ECPAY_RETURN_URL=https://your-public-tunnel-url/api/ecpay/return
ECPAY_ORDER_RESULT_URL=https://your-public-tunnel-url/payment/result
ECPAY_CLIENT_BACK_URL=https://your-public-tunnel-url/payment/result
```

Restart the app after changing `.env`.
