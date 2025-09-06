(() => {
  const nav = document.querySelector('.links');
  if (!nav || !('IntersectionObserver' in window)) return;

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const map   = new Map(); // sectionEl -> linkEl

  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });

  if (!map.size) return;

  const clear = () => links.forEach(a => a.classList.remove('is-active'));

  let current = null;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        current = ent.target;
      } else if (current === ent.target) {
        current = null;
      }
    });

    // 最も画面中央寄りの要素を選ぶ
    const visible = entries
      .filter(ent => ent.isIntersecting)
      .sort((a,b) => Math.abs(0.5 - a.intersectionRatio) - Math.abs(0.5 - b.intersectionRatio));

    if (visible[0]) {
      clear();
      const link = map.get(visible[0].target);
      if (link) link.classList.add('is-active');
    }
  }, {
    rootMargin: '-35% 0% -55% 0%', threshold: [0, 0.25, 0.5, 0.75, 1]
  });

  map.forEach((_, sec) => io.observe(sec));

  // アンカークリック時は手動でハイライトを先につける（体感向上）
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    clear(); a.classList.add('is-active');
  });
})();
