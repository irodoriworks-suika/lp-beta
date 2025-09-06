(() => {
  // 収集（flatMap非使用・古い環境でも安全）
  var singles  = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var parents  = Array.prototype.slice.call(document.querySelectorAll('[data-reveal-children]'));
  var children = [];
  parents.forEach(function(el){ Array.prototype.push.apply(children, el.children); });
  var targets  = singles.concat(children);

  if (!targets.length) return;

  // IO未対応ブラウザは即表示
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function(el){ el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(ent){
      if (ent.isIntersecting) {
        ent.target.classList.add('is-in');
        io.unobserve(ent.target); // 一回でOK
      }
    });
  }, {
    // ちょい甘め（表示領域に少し入ったら出す）
    rootMargin: '-30% 0% -50% 0%',
    threshold: 0.01
  });

  targets.forEach(function(el){ io.observe(el); });
})();
