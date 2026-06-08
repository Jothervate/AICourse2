(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selector = [
    '.floral-hero',
    '.floral-section',
    '.floral-product-card',
    '.floral-panel',
    '.floral-result-card',
    '.floral-mascot-card',
    '.floral-cart-item',
    '.floral-notice'
  ].join(',');

  function markVisible(element) {
    element.classList.add('is-visible');
  }

  function prepare(element, observer) {
    if (!element || element.dataset.revealReady === 'true') return;
    element.dataset.revealReady = 'true';
    element.classList.add('floral-reveal');

    if (reduceMotion || !observer) {
      markVisible(element);
      return;
    }

    observer.observe(element);
    window.setTimeout(function () {
      if (!element.classList.contains('is-visible')) {
        markVisible(element);
        observer.unobserve(element);
      }
    }, 1200);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const targets = document.querySelectorAll(selector);

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (element) {
        element.classList.add('floral-reveal', 'is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        markVisible(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12
    });

    targets.forEach(function (element) {
      prepare(element, observer);
    });

    const mutationObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (!(node instanceof Element)) return;
          if (node.matches(selector)) prepare(node, observer);
          node.querySelectorAll(selector).forEach(function (element) {
            prepare(element, observer);
          });
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
})();
