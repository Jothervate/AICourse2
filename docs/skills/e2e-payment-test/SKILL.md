---
name: e2e-payment-test
description: Use this skill when testing the complete local shopping and ECPay staging payment flow with browser automation, including cart checkout, ECPay card payment, OTP verification, result verification, and evidence capture.
---

# E2E Payment Test Skill

## Goal
Run the complete purchase flow verified with Codex + Playwright MCP:
`shop -> cart -> checkout -> order -> ECPay staging -> card payment -> OTP -> local payment result -> order detail -> database check`.

Use this for recording-ready assignment evidence. Do not modify payment code, CheckMacValue, callbacks, database schema, or frontend design. Use staging/test data only.

## Tool Priority
1. Playwright MCP
2. Browser / in-app browser
3. Chrome MCP
4. Local Playwright script fallback

## Environment
- Project: `C:\Users\user\OneDrive\桌面\2026-ai-adv-homework-course02`
- Start: `npm start`
- Expected URL: `http://localhost:3001`
- If port 3001 changes, use the actual server URL from terminal output.

## Test Data
Local account:
```txt
Name: Codex 測試員
Email: codex-e2e-20260608@example.com
Password: test123456
```
If already logged in, continue. If not, log in or register. If the cart is cleared after login/register, re-add the product while logged in.

Recipient examples:
```txt
Name: Codex Test Receiver
Email: receiver-20260608@example.com
Address: 台北市信義區測試路 1 號

Name: Codex Rerun Receiver
Email: rerun-20260608@example.com
Address: 台北市信義區再測試路 2 號
```

ECPay staging card:
```txt
Card: 4311-9522-2222-2222
Expiry: 12/30 or any future MM/YY
CVV: 222
Holder: CODEX TEST
Phone: 0987654321
Email: test email
Billing address: Taipei Test Road 1
OTP: 1234
```

## Normal Flow Checklist

### 1. Product List
Open `http://localhost:3001/`.

Verify:
- Page title includes `首頁 - 花漾生活`
- Brand `花漾生活` is visible
- Product cards are visible
- `粉色玫瑰花束` is visible
- Price is `NT$ 1,680`
- `加入購物車` button is visible

Evidence: home screenshot.

### 2. Cart
Click the first visible `加入購物車`, then open `/cart`.

Verify:
- Cart badge shows `1`
- `粉色玫瑰花束` appears
- Quantity is `1`
- Subtotal is `NT$ 1,680`
- Total is `NT$ 1,680`
- `前往結帳` button is visible

Evidence: cart screenshot.

### 3. Checkout
Click `前往結帳`.

If redirected to login:
- Register or log in with local test data.
- If cart becomes empty, return to product list, re-add product, and open checkout again.

Verify:
- Page title includes `結帳 - 花漾生活`
- Fields are visible: `收件人姓名`, `Email`, `收件地址`
- Summary shows `粉色玫瑰花束 x 1`
- Total is `NT$ 1,680`
- `確認送出訂單` is visible

Evidence: checkout screenshot.

### 4. Validation
Submit checkout with all recipient fields empty.

Verify:
- URL remains `/checkout`
- No order is created
- Messages appear: `Name is required.`, `Email is required.`, `Address is required.`

Evidence: validation screenshot.

### 5. Create Order
Fill valid recipient data and click `確認送出訂單`.

Expected redirect: `https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5`.

Verify:
- Title includes `選擇支付方式|綠界科技`
- MerchantTradeNo is visible
- Product shows `粉色玫瑰花束 x 1`
- Amount is `NT$1,680`
- Credit card section is visible

Evidence: ECPay payment page screenshot. Record MerchantTradeNo.

## ECPay Card Payment

### 6. Fill Card Form
Important: use real typing/delayed typing for card number fields. Fast direct fill may not trigger ECPay validation.

Fill:
```txt
CCpart1 = 4311
CCpart2 = 9522
CCpart3 = 2222
CCpart4 = 2222
creditMM = 12
creditYY = 30
CreditBackThree = 222
CCHolderTemp = CODEX TEST
CellPhoneCheck = 0987654321
EmailTemp = test email
Address = test billing address
```

After filling Address, trigger blur/change so ECPay's hidden Address field syncs.

Click `立即付款`.

If staging warning appears:
- Click `關閉`
- Click `立即付款` again

Expected confirmation:
```txt
您確定使用信用卡，支付此筆訂單金額(新台幣)1680
```

Click `確定`.

Evidence: confirmation screenshot.

### 7. OTP
Expected redirect: `https://cc-stage.ecpay.com.tw/form_ssl.php`.

Verify:
- Title is `綠界科技 ECPay`
- `交易驗證碼確認` is visible
- Amount is `1,680 TWD`
- Masked card number is visible

Click `取得OTP服務密碼(Get the password)`.

Verify page shows `OTP密碼：1234`.

Fill `OTP = 1234`, then click `送出(Submit)`.

Evidence: OTP screenshot.

## Result Verification

### 8. Payment Result
Expected redirect: `http://localhost:3001/payment/result`.

Verify:
- `付款成功` is visible
- `Payment result received and verified` is visible
- Order number starts with `ORD-`
- Amount is `NT$ 1,680`
- Payment method is `Credit`
- ECPay trade number is visible
- Status is `paid`
- ECPay result is `1 / Succeeded`
- `查看訂單` is visible

Evidence: payment result screenshot. Record local order number and ECPay trade number.

### 9. Order Detail
Click `查看訂單`.

Verify:
- Title includes `訂單詳情 - 花漾生活`
- Order number matches payment result
- Status label is `已付款 (Paid)`
- Recipient data matches submitted data
- Product is `粉色玫瑰花束`
- Quantity is `1`
- Total is `NT$ 1,680`

Check actions:
- `瀏覽商品` is visible
- `取消訂單` may still be visible on paid orders

Known observation: verified paid orders still showed `取消訂單`. Confirm whether this matches the assignment requirement.

Evidence: order detail screenshot.

### 10. Database Check
Run:
```js
const db = require('./src/database');
const order = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 1').get();
console.log(JSON.stringify(order, null, 2));
```

Verify:
- `status = paid`
- `total_amount = 1680`
- `merchant_trade_no` matches ECPay order number
- `ecpay_trade_no` is present
- `ecpay_rtn_code = 1`
- `ecpay_rtn_msg = Succeeded`
- `paid_at` is present

## Console Checks
Check browser console after the flow.

Known non-blocking issue:
```txt
favicon.ico 404
```

Record any unexpected JavaScript errors.

## Failed Payment Test
Do not force failed payment during the normal successful E2E run.

If the user explicitly asks for failed-payment testing:
- Use only supported local test routes or documented test hooks.
- Do not modify ECPay logic.
- Do not manually edit database rows unless explicitly approved.
- Record that it is simulated.

If no safe failed-payment path exists, report it as a known limitation.

## Evidence Names
Recommended screenshot names:
```txt
home.png
cart.png
checkout.png
checkout-validation.png
ecpay-payment-method.png
ecpay-confirm.png
ecpay-3d.png
payment-result.png
order-detail-paid.png
```

Record:
- Local URL
- Test account/data
- MerchantTradeNo
- Local order number
- ECPay trade number
- Final payment status
- Console observations
- Known observations

## Final Report Format
```txt
E2E Payment Test Summary

1. Tool used:
2. Local URL:
3. Test account or test data:
4. Normal flow result:
5. Validation test result:
6. Failed payment test result:
7. ECPay redirect result:
8. Order number created:
9. MerchantTradeNo:
10. ECPay trade number:
11. Final status:
12. Screenshots or recording evidence:
13. Console/network observations:
14. Known limitations:
15. Files created or modified:
```

## Example Successful Result
Use fresh values from the current run. Example:
```txt
Order number: ORD-20260608-AA94E
MerchantTradeNo: ECMQ57LO7KA2A1CA
ECPay trade number: 2606082050218428
Final status: paid
RtnCode: 1
RtnMsg: Succeeded
```
