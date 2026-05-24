(function(){
'use strict';

// Copy email button
const btn = document.getElementById('copyEmailBtn');
const tip = document.getElementById('copyTooltip');
if (btn && tip) {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText('sanskarsharma0310@gmail.com').then(() => {
      tip.classList.add('show');
      setTimeout(() => tip.classList.remove('show'), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = 'sanskarsharma0310@gmail.com';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
      tip.classList.add('show');
      setTimeout(() => tip.classList.remove('show'), 2000);
    });
  });
}

// Shake keyframe injection
const style = document.createElement('style');
style.textContent = `
  @keyframes fieldShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
  .cf-input.shake{animation:fieldShake .35s ease;}
  .cf-input.is-valid-input{border-color:rgba(79,209,197,.6)!important;box-shadow:0 0 0 3px rgba(79,209,197,.08)!important;}
  .cf-input.is-error-input{border-color:rgba(252,129,129,.6)!important;box-shadow:0 0 0 3px rgba(252,129,129,.08)!important;}
`;
document.head.appendChild(style);

// Slide reveals
const slideObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); slideObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '100px 0px 0px 0px' });
document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => slideObs.observe(el));

// Page transitions
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    e.preventDefault();
    if (window.pageWipe) window.pageWipe(() => { window.location.href = href; });
    else window.location.href = href;
  });
});

})();
