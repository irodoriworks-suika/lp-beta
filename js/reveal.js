(() => {
  // 監視対象：メイン直下のセクション（data-reveal付き）
  var targets = Array.prototype.slice.call(
    document.querySelectorAll('main > section[data-reveal]')
  );
  // 念のための後方互換（万一 main 直下じゃない場合）
  if (!targets.length) {
    targets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  }
  if (!targets.length) return;

  // 1) 初期可視化：ロード直後に既に見えているセクションは先に出す
  var vh = window.innerHeight || document.documentElement.clientHeight;
  targets.forEach(function(el){
    var r = el.getBoundingClientRect();
    // 画面の上10%〜下90%にかかっていれば「見えている」とみなす
    var inView = (r.top < vh * 0.90) && (r.bottom > vh * 0.10);
    if (inView) el.classList.add('is-in');
  });

  // 2) 準備完了フラグ：ここで初めて「隠す側」を有効化（白抜け防止）
  requestAnimationFrame(function(){
    document.documentElement.classList.add('reveal-active');
  });

  // 3) IO未対応はここで終了（常時表示のまま）
  if (!('IntersectionObserver' in window)) return;

  // 4) スクロールで順次表示（少し早めに発火して余裕を作る）
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(ent){
      if (ent.isIntersecting) {
        ent.target.classList.add('is-in');
        io.unobserve(ent.target); // 一度きり
      }
    });
  }, {
    rootMargin: '0px 0px -35% 0px', // ビューポート下端の35%手前で出す
    threshold: 0.01
  });

  targets.forEach(function(el){ io.observe(el); });
})();
