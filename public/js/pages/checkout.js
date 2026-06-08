const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    if (!Auth.requireAuth()) return {};

    const loading = ref(true);
    const submitting = ref(false);
    const cartItems = ref([]);
    const form = ref({ recipientName: '', recipientEmail: '', recipientAddress: '' });
    const errors = ref({});

    const cartTotal = computed(function () {
      return cartItems.value.reduce(function (sum, item) {
        return sum + item.product.price * item.quantity;
      }, 0);
    });

    function validate() {
      errors.value = {};
      if (!form.value.recipientName.trim()) errors.value.recipientName = 'Name is required.';
      if (!form.value.recipientEmail.trim()) {
        errors.value.recipientEmail = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.recipientEmail)) {
        errors.value.recipientEmail = 'Email format is invalid.';
      }
      if (!form.value.recipientAddress.trim()) errors.value.recipientAddress = 'Address is required.';
      return Object.keys(errors.value).length === 0;
    }

    async function submitOrder() {
      if (!validate() || submitting.value) return;
      submitting.value = true;
      try {
        const res = await apiFetch('/api/orders', {
          method: 'POST',
          body: JSON.stringify(form.value)
        });
        Notification.show('Order created. Redirecting to payment.', 'success');
        window.location.href = res.data.payment_url || ('/payment/redirect/' + res.data.merchant_trade_no);
      } catch (err) {
        Notification.show(err?.data?.message || 'Failed to create order.', 'error');
      } finally {
        submitting.value = false;
      }
    }

    onMounted(async function () {
      try {
        const res = await apiFetch('/api/cart');
        cartItems.value = res.data.items;
        if (cartItems.value.length === 0) {
          window.location.href = '/cart';
          return;
        }
      } catch (e) {
        window.location.href = '/cart';
        return;
      }
      loading.value = false;
    });

    return { loading, submitting, cartItems, form, errors, cartTotal, submitOrder };
  }
}).mount('#app');
