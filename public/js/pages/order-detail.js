const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    if (!Auth.requireAuth()) return {};

    const el = document.getElementById('app');
    const orderId = el.dataset.orderId;
    const paymentResult = ref(el.dataset.paymentResult || null);

    const order = ref(null);
    const loading = ref(true);
    const canceling = ref(false);

    const statusMap = {
      pending: { label: '待付款 (Pending payment)', cls: 'bg-apricot/20 text-apricot' },
      paid: { label: '已付款 (Paid)', cls: 'bg-sage/20 text-sage' },
      failed: { label: '付款失敗 (Payment failed)', cls: 'bg-red-100 text-red-600' },
      canceled: { label: '已取消 (Canceled)', cls: 'bg-gray-100 text-gray-600' }
    };

    const paymentMessages = {
      success: { text: '付款完成 (Payment completed).', cls: 'bg-sage/10 text-sage border border-sage/20' },
      failed: { text: '付款失敗 (Payment failed).', cls: 'bg-red-50 text-red-600 border border-red-100' },
      cancel: { text: '付款已取消 (Payment was canceled).', cls: 'bg-apricot/10 text-apricot border border-apricot/20' }
    };

    function normalizedStatus(status) {
      const value = String(status || '').toLowerCase();
      if (value === 'paid') return 'paid';
      if (value === 'failed') return 'failed';
      if (['canceled', 'cancelled', 'cancel'].includes(value)) return 'canceled';
      if (['pending', 'unpaid'].includes(value)) return 'pending';
      return value;
    }

    function isPending(status) {
      return normalizedStatus(status) === 'pending';
    }

    function isFailed(status) {
      return normalizedStatus(status) === 'failed';
    }

    function isCanceled(status) {
      return normalizedStatus(status) === 'canceled';
    }

    function isCancelable(status) {
      return ['pending', 'paid'].includes(normalizedStatus(status));
    }

    async function cancelOrder() {
      if (!order.value || canceling.value) return;
      canceling.value = true;
      try {
        const res = await apiFetch('/api/orders/' + order.value.id + '/cancel', {
          method: 'POST'
        });
        order.value = res.data;
        Notification.show('訂單已取消 (Order canceled).', 'success');
      } catch (e) {
        Notification.show(e?.data?.message || '取消訂單失敗 (Failed to cancel order).', 'error');
      } finally {
        canceling.value = false;
      }
    }

    onMounted(async function () {
      try {
        const res = await apiFetch('/api/orders/' + orderId);
        order.value = res.data;
      } catch (e) {
        Notification.show('載入訂單失敗 (Failed to load order).', 'error');
      } finally {
        loading.value = false;
      }
    });

    return {
      order,
      loading,
      canceling,
      paymentResult,
      statusMap,
      paymentMessages,
      normalizedStatus,
      isPending,
      isFailed,
      isCanceled,
      isCancelable,
      cancelOrder
    };
  }
}).mount('#app');
