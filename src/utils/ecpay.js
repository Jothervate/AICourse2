const crypto = require('crypto');

const STAGING_CHECKOUT_URL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
const PRODUCTION_CHECKOUT_URL = 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5';

function getCheckoutUrl() {
  return process.env.ECPAY_ENV === 'production' ? PRODUCTION_CHECKOUT_URL : STAGING_CHECKOUT_URL;
}

function getBaseUrl() {
  return (process.env.BASE_URL || 'http://localhost:3001').replace(/\/+$/, '');
}

function getMerchantConfig() {
  const merchantId = process.env.ECPAY_MERCHANT_ID;
  const hashKey = process.env.ECPAY_HASH_KEY;
  const hashIv = process.env.ECPAY_HASH_IV;

  if (!merchantId || !hashKey || !hashIv) {
    throw new Error('ECPay environment variables are not fully configured');
  }

  return { merchantId, hashKey, hashIv };
}

function formatTradeDate(date = new Date()) {
  const pad = value => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('/') + ' ' + [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join(':');
}

function encodeEcpayValue(value) {
  return encodeURIComponent(value)
    .toLowerCase()
    .replace(/%20/g, '+')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')');
}

function generateCheckMacValue(params) {
  const { hashKey, hashIv } = getMerchantConfig();
  const sorted = Object.keys(params)
    .filter(key => key !== 'CheckMacValue' && params[key] !== undefined && params[key] !== null)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const raw = `HashKey=${hashKey}&${sorted}&HashIV=${hashIv}`;
  const encoded = encodeEcpayValue(raw);

  return crypto
    .createHash('sha256')
    .update(encoded)
    .digest('hex')
    .toUpperCase();
}

function verifyCheckMacValue(receivedParams) {
  const received = receivedParams.CheckMacValue;
  if (!received) return false;

  const expected = generateCheckMacValue(receivedParams);
  const receivedBuffer = Buffer.from(String(received).toUpperCase());
  const expectedBuffer = Buffer.from(expected);

  return receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

function sanitizeItemName(value) {
  return String(value || 'Local Order')
    .replace(/[^\w\s\u4e00-\u9fff\-#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180) || 'Local Order';
}

function getClientBackUrl(merchantTradeNo) {
  const configured = process.env.ECPAY_CLIENT_BACK_URL;
  if (!configured) {
    return `${getBaseUrl()}/payment/result/${merchantTradeNo}`;
  }

  const trimmed = configured.replace(/\/+$/, '');
  if (trimmed.includes(':merchantTradeNo')) {
    return trimmed.replace(':merchantTradeNo', merchantTradeNo);
  }
  if (trimmed.endsWith('/payment/result')) {
    return `${trimmed}/${merchantTradeNo}`;
  }
  return configured;
}

function getOrderResultUrl() {
  return process.env.ECPAY_ORDER_RESULT_URL || `${getBaseUrl()}/payment/result`;
}

function buildCheckoutParams(order, items = []) {
  const { merchantId } = getMerchantConfig();
  const baseUrl = getBaseUrl();
  const merchantTradeNo = order.merchant_trade_no || order.order_no;
  const itemName = items.length
    ? items.map(item => `${sanitizeItemName(item.product_name)} x ${item.quantity}`).join('#')
    : `Order ${order.order_no}`;

  const params = {
    MerchantID: merchantId,
    MerchantTradeNo: merchantTradeNo,
    MerchantTradeDate: formatTradeDate(),
    PaymentType: 'aio',
    TotalAmount: Math.max(1, parseInt(order.total_amount, 10)),
    TradeDesc: 'Local staging checkout',
    ItemName: sanitizeItemName(itemName),
    ReturnURL: process.env.ECPAY_RETURN_URL || `${baseUrl}/api/ecpay/return`,
    OrderResultURL: getOrderResultUrl(),
    ChoosePayment: 'Credit',
    ClientBackURL: getClientBackUrl(merchantTradeNo),
    EncryptType: 1
  };

  return {
    ...params,
    CheckMacValue: generateCheckMacValue(params)
  };
}

module.exports = {
  buildCheckoutParams,
  formatTradeDate,
  generateCheckMacValue,
  getCheckoutUrl,
  verifyCheckMacValue
};
