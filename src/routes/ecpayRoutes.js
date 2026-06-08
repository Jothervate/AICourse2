const express = require('express');
const db = require('../database');
const {
  buildCheckoutParams,
  getCheckoutUrl,
  verifyCheckMacValue
} = require('../utils/ecpay');

const router = express.Router();

function getOrderByMerchantTradeNo(merchantTradeNo) {
  return db.prepare(
    `SELECT * FROM orders
     WHERE merchant_trade_no = ? OR order_no = ?`
  ).get(merchantTradeNo, merchantTradeNo);
}

function getOrderItems(orderId) {
  return db.prepare(
    'SELECT product_name, product_price, quantity FROM order_items WHERE order_id = ?'
  ).all(orderId);
}

function applyEcpayResult(receivedParams) {
  if (!verifyCheckMacValue(receivedParams)) {
    return { ok: false, status: 400, message: 'CheckMacValue invalid' };
  }

  const order = getOrderByMerchantTradeNo(receivedParams.MerchantTradeNo);
  if (!order) {
    return { ok: false, status: 404, message: 'Order not found' };
  }

  const rtnCode = String(receivedParams.RtnCode || '');
  const status = rtnCode === '1' ? 'paid' : 'failed';
  const paidAt = status === 'paid' ? new Date().toISOString() : order.paid_at;

  db.prepare(
    `UPDATE orders
     SET status = ?,
         ecpay_trade_no = ?,
         ecpay_rtn_code = ?,
         ecpay_rtn_msg = ?,
         paid_at = ?
     WHERE id = ?`
  ).run(
    status,
    receivedParams.TradeNo || order.ecpay_trade_no || null,
    rtnCode || order.ecpay_rtn_code || null,
    receivedParams.RtnMsg || order.ecpay_rtn_msg || null,
    paidAt || null,
    order.id
  );

  const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id);
  return { ok: true, order: updatedOrder };
}

function renderPaymentResult(res, order, message) {
  res.render('pages/payment-result', {
    title: '付款結果 (Payment result)',
    order,
    message
  }, function (err, body) {
    if (err) return res.status(500).send(err.message);
    res.render('layouts/front', { body, title: 'Payment result', pageScript: '' });
  });
}

router.get('/payment/redirect/:merchantTradeNo', (req, res, next) => {
  try {
    const order = getOrderByMerchantTradeNo(req.params.merchantTradeNo);
    if (!order) {
      return res.status(404).render('pages/payment-result', {
        title: '付款結果 (Payment result)',
        order: null,
        message: '找不到訂單 (Order not found).'
      }, function (err, body) {
        if (err) return res.status(500).send(err.message);
        res.render('layouts/front', { body, title: '付款結果 (Payment result)', pageScript: '' });
      });
    }

    const items = getOrderItems(order.id);
    const params = buildCheckoutParams(order, items);

    res.render('pages/ecpay-redirect', {
      title: 'Redirecting to ECPay',
      checkoutUrl: getCheckoutUrl(),
      params
    });
  } catch (err) {
    next(err);
  }
});

router.post('/api/ecpay/return', (req, res) => {
  const result = applyEcpayResult(req.body || {});
  if (!result.ok) {
    return res.status(result.status).send(`0|${result.message}`);
  }

  res.send('1|OK');
});

router.get('/payment/result', (req, res) => {
  res.redirect('/');
});

router.post('/payment/result', (req, res) => {
  const result = applyEcpayResult(req.body || {});
  if (!result.ok) {
    return renderPaymentResult(res, null, `付款結果未通過驗證 (Payment result rejected): ${result.message}`);
  }

  renderPaymentResult(res, result.order, '付款結果已接收並驗證完成 (Payment result received and verified).');
});

router.get('/payment/result/:merchantTradeNo', (req, res, next) => {
  try {
    const order = getOrderByMerchantTradeNo(req.params.merchantTradeNo);
    const message = order
      ? '付款狀態如下方所示；localhost callback 需要公開 tunnel 才能自動更新 (Payment status is shown below. Localhost callbacks require a public tunnel to update automatically).'
      : '找不到訂單 (Order not found).';

    renderPaymentResult(res, order, message);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
