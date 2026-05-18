(function(){
'use strict';
// Coming-soon particle emitters
document.querySelectorAll('.cs-particles').forEach(canvas => {
  const ctx = canvas.getContext('2d');
  const particles = Array.from({length: 30}, () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 20,
    vy: -(0.3 + Math.random() * 0.8),
    vx: (Math.random() - 0.5) * 0.4,
    r: 1 + Math.random() * 2,
    alpha: Math.random() * 0.6 + 0.2
  }));
  let paused = false;
  const card = canvas.closest('.cs-card');
  card.addEventListener('mouseenter', () => paused = false);
  card.addEventListener('mouseleave', () => paused = true);
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      if (!paused) {
        p.y += p.vy; p.x += p.vx; p.alpha -= 0.003;
        if (p.y < -10 || p.alpha <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.alpha = Math.random() * 0.5 + 0.2;
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,179,237,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
});
// Page transitions
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.includes('.pdf')) return;
    e.preventDefault();
    if (window.pageWipe) window.pageWipe(() => { window.location.href = href; });
    else window.location.href = href;
  });
});
})();
