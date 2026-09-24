(() => {
  if (!matchMedia('(max-width:760px)').matches) return;
  const selector = '.site-header a,.catalog-header a,.product-header a,.editorial-header a';
  const clearNavigationFeedback = () => {
    document.querySelectorAll(`${selector},.site-header button,.catalog-header button,.product-header button,.editorial-header button`).forEach((item) => {
      item.classList.remove('is-nav-activating');
      if (item.matches(':focus')) item.blur();
    });
  };
  window.addEventListener('pagehide', clearNavigationFeedback);
  window.addEventListener('pageshow', clearNavigationFeedback);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) clearNavigationFeedback();
  });
  document.querySelectorAll(selector).forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = link.getAttribute('href');
      if (!target || target === '#') return;
      event.preventDefault();
      if (link.classList.contains('is-nav-activating')) return;
      link.classList.add('is-nav-activating');
      window.setTimeout(() => {
        link.classList.remove('is-nav-activating');
        link.blur();
        location.href = link.href;
      }, 230);
    });
  });
})();
