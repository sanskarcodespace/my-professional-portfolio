/* ════════════════════════════════════════════
   LOADER.JS — Loading Screen + Page Wipe
════════════════════════════════════════════ */

(function() {
'use strict';

// ── 1. INJECT LOADER HTML ────────────────────
const loaderHTML = `
<div id="loader">
  <svg id="loaderMonogram" width="120" height="100" viewBox="0 0 120 100" fill="none"
       xmlns="http://www.w3.org/2000/svg" aria-label="SS Monogram">
    <!-- First S -->
    <path id="s1" d="
      M10 25 Q10 12 22 12 L44 12 Q56 12 56 24 Q56 36 44 36 L22 36 Q10 36 10 48 Q10 60 22 60 L44 60 Q56 60 56 72
    " stroke="url(#grad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
      fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <!-- Second S -->
    <path id="s2" d="
      M64 25 Q64 12 76 12 L98 12 Q110 12 110 24 Q110 36 98 36 L76 36 Q64 36 64 48 Q64 60 76 60 L98 60 Q110 60 110 72
    " stroke="url(#grad2)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
      fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <!-- Accent dot -->
    <circle id="monoDot" cx="60" cy="85" r="3" fill="url(#grad)" opacity="0"/>
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"  stop-color="#63B3ED"/>
        <stop offset="100%" stop-color="#9F7AEA"/>
      </linearGradient>
      <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"  stop-color="#9F7AEA"/>
        <stop offset="100%" stop-color="#4FD1C5"/>
      </linearGradient>
    </defs>
  </svg>
  <div id="loaderProgress"><div id="loaderProgressFill"></div></div>
  <div id="loaderLabel">Initializing</div>
</div>
<div id="loaderFlare"></div>
<div id="pageWipe"></div>
`;
document.body.insertAdjacentHTML('afterbegin', loaderHTML);

// ── 2. ANIMATE SVG PATHS ─────────────────────
function animateStroke(pathId, delay, dur) {
  const el = document.getElementById(pathId);
  if (!el) return;
  el.style.strokeDashoffset = '1';
  el.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { el.style.strokeDashoffset = '0'; });
  });
}

// ── 3. PROGRESS BAR ──────────────────────────
const fill = document.getElementById('loaderProgressFill');
const label = document.getElementById('loaderLabel');
const labels = ['Initializing', 'Loading Assets', 'Calibrating', 'Ready'];
let prog = 0;
const progInterval = setInterval(() => {
  prog = Math.min(100, prog + (Math.random() * 4 + 1));
  if (fill) fill.style.width = prog + '%';
  const li = Math.floor(prog / 33);
  if (label && labels[li]) label.textContent = labels[li];
}, 35);

// ── 4. BOOT SEQUENCE ─────────────────────────
function bootLoader() {
  // Draw first S at 200ms
  setTimeout(() => animateStroke('s1', 0, 600), 200);
  // Draw second S at 500ms
  setTimeout(() => animateStroke('s2', 0, 600), 500);
  // Accent dot
  setTimeout(() => {
    const dot = document.getElementById('monoDot');
    if (dot) { dot.style.transition = 'opacity 0.4s ease'; dot.style.opacity = '1'; }
  }, 1000);

  // ── EXIT at 2200ms ───────────────────────
  setTimeout(() => {
    clearInterval(progInterval);
    if (fill) fill.style.width = '100%';
    if (label) label.textContent = 'Ready';

    setTimeout(() => {
      // Flash
      const flare = document.getElementById('loaderFlare');
      if (flare) flare.classList.add('flash');

      // Implode
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('implode');

      setTimeout(() => {
        if (loader) loader.style.display = 'none';
        if (flare) flare.style.display = 'none';
        // Cascade hero entries
        cascadeHeroEntries();
      }, 520);
    }, 180);

  }, 2200);
}

// ── 5. HERO CASCADE ──────────────────────────
function cascadeHeroEntries() {
  const entries = document.querySelectorAll('.hero-entry');
  entries.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), i * 120);
  });
  // Trigger hero letter animation
  if (typeof window.initHeroLetters === 'function') {
    setTimeout(window.initHeroLetters, 100);
  }
}

// ── START ────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootLoader);
} else {
  bootLoader();
}

// ── PAGE WIPE (exported) ─────────────────────
window.pageWipe = function(callback) {
  const wipe = document.getElementById('pageWipe');
  if (!wipe) { if (callback) callback(); return; }
  wipe.classList.remove('wipe-out');
  wipe.classList.add('wipe-in');
  wipe.style.pointerEvents = 'all';
  setTimeout(() => {
    if (callback) callback();
    wipe.classList.remove('wipe-in');
    wipe.classList.add('wipe-out');
    setTimeout(() => {
      wipe.style.pointerEvents = 'none';
      wipe.classList.remove('wipe-out');
    }, 420);
  }, 420);
};

})();
