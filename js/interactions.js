/* ════════════════════════════════════════════
   INTERACTIONS.JS — Cursor, Parallax, 3D Tilt,
   Scroll Progress, Section Depth
════════════════════════════════════════════ */

(function() {
'use strict';

const isFine = window.matchMedia('(pointer: fine)').matches;

// ════════════════════════════════════════════
// CUSTOM CURSOR — spring physics
// ════════════════════════════════════════════
if (isFine) {
  // Reuse existing elements from HTML, or create if missing
  let dot  = document.getElementById('cursor-dot');
  let ring = document.getElementById('cursor-ring');
  let lbl  = document.getElementById('cursor-label');
  if (!dot)  { dot  = document.createElement('div');  dot.id  = 'cursor-dot';  document.body.appendChild(dot); }
  if (!ring) { ring = document.createElement('div');  ring.id = 'cursor-ring'; document.body.appendChild(ring); }
  if (!lbl)  { lbl  = document.createElement('span'); lbl.id  = 'cursor-label'; ring.appendChild(lbl); }


  let mx = window.innerWidth  / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my; // ring position (spring-lagged)

  // Spring constants
  const SPRING = 0.12;
  const DAMP   = 0.78;
  let rvx = 0, rvy = 0;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function cursorLoop() {
    // Dot: instant
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';

    // Ring: spring physics
    const fx = (mx - rx) * SPRING;
    const fy = (my - ry) * SPRING;
    rvx = (rvx + fx) * DAMP;
    rvy = (rvy + fy) * DAMP;
    rx += rvx; ry += rvy;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  // ── Cursor state management ──
  function setCursorState(state, labelText) {
    document.body.classList.remove('cursor-link', 'cursor-btn', 'cursor-img');
    if (state) document.body.classList.add('cursor-' + state);
    lbl.textContent = labelText || '';
  }

  // Links
  document.querySelectorAll('a:not(.btn), .nav-link, .project-link, .footer-top, .mob-link')
    .forEach(el => {
      el.addEventListener('mouseenter', () => setCursorState('link', 'VIEW'));
      el.addEventListener('mouseleave', () => setCursorState(null));
    });

  // Buttons
  document.querySelectorAll('.btn, .theme-toggle, .hamburger, .social-btn')
    .forEach(el => {
      el.addEventListener('mouseenter', () => setCursorState('btn'));
      el.addEventListener('mouseleave', () => setCursorState(null));
    });

  // Images / avatar
  document.querySelectorAll('.hero-avatar, .project-img, .project-img-placeholder')
    .forEach(el => {
      el.addEventListener('mouseenter', () => setCursorState('img', 'EXPLORE'));
      el.addEventListener('mouseleave', () => setCursorState(null));
    });
}

// ════════════════════════════════════════════
// SCROLL PROGRESS INDICATOR
// ════════════════════════════════════════════
const scrollBar = document.getElementById('scrollProgress');
function updateScrollProgress() {
  if (!scrollBar) return;
  const doc  = document.documentElement;
  const pct  = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
  scrollBar.style.height = Math.min(100, pct) + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ════════════════════════════════════════════
// PARALLAX — background at 0.3×, text at 1×
// ════════════════════════════════════════════
function updateParallax() {
  const sy = window.scrollY;
  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg) heroBg.style.transform = `translateY(${sy * 0.3}px)`;
  const circuitBg = document.querySelector('.circuit-bg');
  if (circuitBg) circuitBg.style.transform = `translateY(${sy * 0.15}px)`;
  // Note: orbs use CSS keyframe animation — don't override with JS
}
window.addEventListener('scroll', updateParallax, { passive: true });

// ════════════════════════════════════════════
// 3D CARD TILT — mouse-tracked perspective
// ════════════════════════════════════════════
document.querySelectorAll('.project-card').forEach(card => {
  // Inject gloss layer
  if (!card.querySelector('.project-gloss')) {
    const gloss = document.createElement('div');
    gloss.className = 'project-gloss';
    card.style.position = 'relative';
    card.appendChild(gloss);
  }
  const gloss = card.querySelector('.project-gloss');
  const MAX   = 8; // degrees

  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;   // 0–1
    const cy = (e.clientY - r.top)  / r.height;  // 0–1
    const rx = (cy - 0.5) * MAX * -2;  // tilt X
    const ry = (cx - 0.5) * MAX *  2;  // tilt Y

    card.style.transform = `
      perspective(800px)
      rotateX(${rx}deg)
      rotateY(${ry}deg)
      translateY(-8px)
      scale(1.01)
    `;

    // Gloss highlight follows cursor
    if (gloss) {
      gloss.style.setProperty('--mx', (cx * 100) + '%');
      gloss.style.setProperty('--my', (cy * 100) + '%');
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => card.style.transition = '', 700);
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.15s ease';
  });
});

// ════════════════════════════════════════════
// MAGNETIC BUTTONS — follow cursor in radius
// ════════════════════════════════════════════
document.querySelectorAll('.btn-primary').forEach(btn => {
  const RADIUS = 60;
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < RADIUS) {
      const pull = (1 - dist / RADIUS) * 0.4;
      btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px) translateY(-3px)`;
    }
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    setTimeout(() => btn.style.transition = '', 600);
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.1s ease';
  });
});

// ════════════════════════════════════════════
// SECTION DEPTH SHIFT on scroll
// ════════════════════════════════════════════
const depthObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle('in-view', e.isIntersecting);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.section').forEach(s => {
  s.classList.add('section-depth');
  depthObs.observe(s);
});

// ════════════════════════════════════════════
// HERO ENTRY — add .hero-entry to hero children
// ════════════════════════════════════════════
(function applyHeroEntries() {
  document.querySelectorAll('.hero-content > *').forEach(el => {
    el.classList.add('hero-entry');
  });
  document.querySelectorAll('.hero-avatar-wrap').forEach(el => {
    el.classList.add('hero-entry');
  });
  // Safety: if loader doesn't fire within 3s, show hero anyway
  setTimeout(() => {
    document.querySelectorAll('.hero-entry:not(.in)').forEach(el => {
      el.classList.add('in');
    });
  }, 3200);
})();

})();
