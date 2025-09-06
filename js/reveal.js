(() => {
  // 対象収集（古い環境でも動く書き方）
  var singles  = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var parents  = Array.prototype.slice.call(document.querySelectorAll('[data-reveal-children]'));
  var children = [];
  parents.forEach(function(el){ Array.prototype.push.apply(children, el.children); });
  var targets  = singles.concat(children);
  if (!targets.length) return;

  // 1) 初期可視化：最初からビューポート内の要素は is-in を先に付ける
  var vh = window.innerHeight || document.documentElement.clientHeight;
  targets.forEach(function(el){
    var r = el.getBoundingClientRect();
    // 画面の 15%〜85% にかかっていれば“見えている”とみなす
    var inView = (r.top < vh * 0.85) && (r.bottom > vh * 0.15);
    if (inView) el.classList.add('is-in');
  });

  // 2) 準備完了フラグ：ここで初めて非表示ガードを有効化（CSSが効く）
  requestAnimationFrame(function(){
    document.documentElement.classList.add('reveal-active');
  });

  // 3) IO未対応は即終了（この場合は常に表示のまま）
  if (!('IntersectionObserver' in window)) return;

  // 4) スクロールで順次表示
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(ent){
      if (ent.isIntersecting) {
        ent.target.classList.add('is-in');
        io.unobserve(ent.target); // 一回でOK
      }
    });
  }, {
    // 上30%/下50%をオフセット。少し入ったら出す
    rootMargin: '-30% 0% -50% 0%',
    threshold: 0.01
  });

  targets.forEach(function(el){ io.observe(el); });
})();
