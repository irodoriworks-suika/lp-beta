// js/main.js
(() => {
  // ===== 設定 =====
  const BP = 768; // 768px以上でドロワーは自動クローズ
  const SELECTORS = {
    btn: '#hamburger',
    drawer: '#site-menu',
    backdrop: '#backdrop'
  };

  // ===== 要素取得 =====
  const body = document.body;
  const btn = document.querySelector(SELECTORS.btn);
  const drawer = document.querySelector(SELECTORS.drawer);
  const backdrop = document.querySelector(SELECTORS.backdrop);

  if (!btn || !drawer || !backdrop) {
    // 必須要素がなければ何もしない
    return;
  }

  // ===== ユーティリティ =====
  let lastFocused = null; // 開く前のフォーカス復帰用

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const setAria = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    backdrop.hidden = !open;
  };

  const openDrawer = () => {
    if (body.classList.contains('is-drawer-open')) return;
    lastFocused = document.activeElement;

    body.classList.add('is-drawer-open', 'no-scroll');
    setAria(true);

    // 最初のフォーカス先
    const first = drawer.querySelector(focusableSelector);
    if (first) first.focus({ preventScroll: true });

    // フォーカストラップ（Tabでドロワー内をループ）
    document.addEventListener('keydown', trapFocus);
  };

  const closeDrawer = () => {
    if (!body.classList.contains('is-drawer-open')) return;

    body.classList.remove('is-drawer-open', 'no-scroll');
    setAria(false);

    // フォーカスをハンバーガーに戻す
    (lastFocused || btn).focus({ preventScroll: true });

    document.removeEventListener('keydown', trapFocus);
  };

  const toggleDrawer = () =>
    body.classList.contains('is-drawer-open') ? closeDrawer() : openDrawer();

  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusables = Array.from(
      drawer.querySelectorAll(focusableSelector)
    ).filter(el => el.offsetParent !== null);

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      last.focus(); e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus(); e.preventDefault();
    }
  }

  // ===== イベント紐付け =====
  btn.addEventListener('click', toggleDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // メニュー項目クリックで閉じる
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeDrawer();
  });

  // 画面幅が広がったら自動クローズ
  window.addEventListener('resize', () => {
    if (window.innerWidth >= BP) closeDrawer();
  });

  // ===== GA4：data-gtag-* 付きリンクのイベント送信（任意）
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-gtag-event]');
    if (!a || typeof window.gtag !== 'function') return;
    window.gtag('event', a.dataset.gtagEvent, {
      event_label: a.dataset.gtagLabel || ''
    });
  });
})();
