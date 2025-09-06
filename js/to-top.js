(() => {
  // JS有効フラグ（既にheadに入れていなければ有効化）
  document.documentElement.classList.add('js-enabled');

  const btn = document.querySelector('.to-top');
  if (!btn) return;

  // 表示トリガーはヒーローセクションが画面外になったら
  const target = document.querySelector('.hero') || document.querySelector('main');

  if ('IntersectionObserver' in window && target) {
    const io = new IntersectionObserver(([entry]) => {
      // ヒーローが見えている間は非表示、見えなくなったら表示
      if (entry.isIntersecting) {
        btn.classList.remove('is-visible');
      } else {
        btn.classList.add('is-visible');
      }
    }, {
      rootMargin: '-10% 0% -80% 0%', // ほんの少しスクロールで表示
      threshold: 0.01
    });
    io.observe(target);
  } else {
    // フォールバック：scrollYで判定
    const onScroll = () => {
      if (window.scrollY > 300) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
