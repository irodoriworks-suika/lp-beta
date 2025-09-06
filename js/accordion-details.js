(() => {
  const root = document.querySelector('#faq');
  if (!root) return;

  const modeSingle = root.dataset.accordion === 'single';
  const items = [...root.querySelectorAll('details')];

  // iOS対策：<summary>クリック時にスムーススクロールしないよう抑止（任意）
  root.addEventListener('click', (e) => {
    const sum = e.target.closest('summary');
    if (!sum) return;
    // summaryのデフォルト挙動は残しつつ、ページジャンプを防ぎたい時だけ：
    sum.setAttribute('tabindex', '0');
  });

  // 単一開閉モード：開いたら他を閉じる
  if (modeSingle) {
    root.addEventListener('toggle', (e) => {
      const opened = e.target;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
      items.forEach(d => { if (d !== opened) d.open = false; });
    });
  }
})();
