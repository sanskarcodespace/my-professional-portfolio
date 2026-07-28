/* ── LOADER.JS ── */
(function() {
'use strict';

const path = window.location.pathname.replace(/\/$/, '').split('/').pop();
const isHome = path === '' || path === 'index.html' || path === 'index' || window.location.pathname === '/';

/* ── PAGE WIPE (all pages) ─────────────────── */
window.pageWipe = function(cb) {
  const w = document.getElementById('pageWipe');
  if (!w) { if (cb) cb(); return; }
  w.classList.remove('wipe-out');
  w.classList.add('wipe-in');
  w.style.pointerEvents = 'all';
  setTimeout(() => {
    if (cb) cb();
    w.classList.remove('wipe-in');
    w.classList.add('wipe-out');
    setTimeout(() => { w.style.pointerEvents = 'none'; w.classList.remove('wipe-out'); }, 440);
  }, 420);
};

/* ── INNER PAGES ───────────────────────────── */
if (!isHome) {
  /* Clear any stuck page-wipe overlay and restore page visibility */
  function clearWipe() {
    const w = document.getElementById('pageWipe');
    if (w) {
      w.classList.remove('wipe-in', 'wipe-out');
      w.style.transform = 'scaleX(0)';
      w.style.pointerEvents = 'none';
    }
    document.documentElement.style.opacity = '1';
    document.documentElement.style.transition = '';
  }

  /* Set opacity 0 for smooth fade-in */
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity 0.25s ease';

  /* Multiple fallbacks — fire whichever comes first */
  const reveal = () => requestAnimationFrame(clearWipe);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reveal);
  } else {
    reveal();
  }
  /* Hard fallbacks in case RAF or DOMContentLoaded fires late */
  setTimeout(clearWipe, 100);
  setTimeout(clearWipe, 500);
  return;
}


/* ── HOME PAGE LOADER ──────────────────────── */
document.body.insertAdjacentHTML('afterbegin', `
<div id="loader">
  <svg id="loaderMonogram" width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path id="s1" d="M10 25 Q10 12 22 12 L44 12 Q56 12 56 24 Q56 36 44 36 L22 36 Q10 36 10 48 Q10 60 22 60 L44 60 Q56 60 56 72"
      stroke="url(#g1)" stroke-width="5" stroke-linecap="round" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <path id="s2" d="M64 25 Q64 12 76 12 L98 12 Q110 12 110 24 Q110 36 98 36 L76 36 Q64 36 64 48 Q64 60 76 60 L98 60 Q110 60 110 72"
      stroke="url(#g2)" stroke-width="5" stroke-linecap="round" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <circle id="monoDot" cx="60" cy="85" r="3" fill="url(#g1)" opacity="0"/>
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#63B3ED"/><stop offset="100%" stop-color="#9F7AEA"/></linearGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#9F7AEA"/><stop offset="100%" stop-color="#4FD1C5"/></linearGradient>
    </defs>
  </svg>
  <div id="loaderProgress"><div id="loaderProgressFill"></div></div>
  <div id="loaderLabel">Initializing</div>
</div>
<div id="loaderFlare"></div>
`);

function animateStroke(id, delay, dur) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.strokeDashoffset = '1';
  el.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`;
  requestAnimationFrame(() => requestAnimationFrame(() => { el.style.strokeDashoffset = '0'; }));
}

const fill  = document.getElementById('loaderProgressFill');
const label = document.getElementById('loaderLabel');
const labs  = ['Initializing','Loading Assets','Calibrating','Ready'];
let prog = 0;
const pi = setInterval(() => {
  prog = Math.min(100, prog + Math.random()*4+1);
  if (fill)  fill.style.width = prog + '%';
  if (label) label.textContent = labs[Math.min(3, Math.floor(prog/33))];
}, 35);

function cascadeHero() {
  // Support both old pages (hero-entry) and rebuilt hero (hero-anim)
  document.querySelectorAll('.hero-entry').forEach((el,i) => setTimeout(() => el.classList.add('in'), i*120));
  document.querySelectorAll('.hero-anim').forEach(el => setTimeout(() => el.classList.add('in'), 50));
  if (typeof window.initHeroLetters === 'function') setTimeout(window.initHeroLetters, 100);
  if (typeof window.initHeroEntries === 'function') setTimeout(window.initHeroEntries, 150);
}

function boot() {
  setTimeout(() => animateStroke('s1', 0, 600), 200);
  setTimeout(() => animateStroke('s2', 0, 600), 500);
  setTimeout(() => { const d = document.getElementById('monoDot'); if(d){ d.style.transition='opacity .4s'; d.style.opacity='1'; }}, 1000);
  setTimeout(() => {
    clearInterval(pi);
    if (fill) fill.style.width = '100%';
    if (label) label.textContent = 'Ready';
    setTimeout(() => {
      const fl = document.getElementById('loaderFlare');
      const lo = document.getElementById('loader');
      if (fl) fl.classList.add('flash');
      if (lo) lo.classList.add('implode');
      setTimeout(() => {
        if (lo) lo.style.display = 'none';
        if (fl) fl.style.display = 'none';
        cascadeHero();
      }, 520);
    }, 180);
  }, 2200);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
