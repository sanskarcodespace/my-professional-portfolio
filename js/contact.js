(function(){
'use strict';
// Copy email
const btn = document.getElementById('copyEmailBtn');
const tip = document.getElementById('copyTooltip');
if (btn) {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText('sanskarsharma0310@gmail.com').then(() => {
      tip.classList.add('show');
      setTimeout(() => tip.classList.remove('show'), 2000);
    });
  });
}
// Form submission
const form = document.getElementById('contactForm');
const submit = document.getElementById('cfSubmit');
const success = document.getElementById('cfSuccess');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = form.querySelectorAll('.cf-input');
    let valid = true;
    fields.forEach(f => {
      if (!f.value.trim()) {
        valid = false;
        f.classList.add('error');
        f.addEventListener('input', () => f.classList.remove('error'), { once: true });
        f.style.animation = 'shake .4s ease';
        setTimeout(() => f.style.animation = '', 400);
      }
    });
    if (!valid) return;
    submit.classList.add('loading');
    setTimeout(() => {
      submit.classList.remove('loading');
      form.style.display = 'none';
      success.classList.add('show');
      success.style.display = 'flex';
    }, 1500);
  });
}
// Add shake keyframe
const style = document.createElement('style');
style.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}} .cf-input.error{border-color:#FC8181!important;box-shadow:0 0 0 3px rgba(252,129,129,.15)!important}';
document.head.appendChild(style);
// Slide reveals
const slideObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); slideObs.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => slideObs.observe(el));
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
