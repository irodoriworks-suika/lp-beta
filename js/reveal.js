(() => {
  const singles  = [...document.querySelectorAll('[data-reveal]')];
  const children = [...document.querySelectorAll('[data-reveal-children]')]
                    .flatMap(el => [...el.children]);

  const targets = [...new Set([...singles, ...children])];
  if (!targets.length) return;

  // Fallback（古い環境）は即表示
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('is-in');
        io.unobserve(ent.target); // 一度だけ
      }
    });
  }, {
    // 画面中央に少し入ったら発火（上40%／下55%オフセット）
    rootMargin: '-40% 0% -55% 0%', threshold: 0.01
  });

  targets.forEach(el => io.observe(el));
})();
