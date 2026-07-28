/* ════════════════════════════════════════════
   INTERACTIONS.JS — v2 Premium Interaction System
   Cursor · Nav · Cards · Forms · Scanner Beam
════════════════════════════════════════════ */
(function () {
'use strict';

const isFine = window.matchMedia('(pointer: fine)').matches;

/* ═══════════════════════════════════════════
   1. CUSTOM CURSOR — spring physics
═══════════════════════════════════════════ */
if (isFine) {
  let dot  = document.getElementById('cursor-dot');
  let ring = document.getElementById('cursor-ring');
  let lbl  = document.getElementById('cursor-label');
  if (!dot)  { dot  = document.createElement('div');  dot.id  = 'cursor-dot';  document.body.appendChild(dot); }
  if (!ring) { ring = document.createElement('div');  ring.id = 'cursor-ring'; document.body.appendChild(ring); }
  if (!lbl)  { lbl  = document.createElement('span'); lbl.id  = 'cursor-label'; ring.appendChild(lbl); }

  let mx = innerWidth/2, my = innerHeight/2;
  let rx = mx, ry = my, rvx = 0, rvy = 0;
  const SPRING = 0.12, DAMP = 0.78;

  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function cursorLoop() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
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

  function setCursor(state, label) {
    document.body.classList.remove('cursor-link','cursor-btn','cursor-img');
    if (state) document.body.classList.add('cursor-' + state);
    lbl.textContent = label || '';
  }
  document.querySelectorAll('a:not(.btn), .nav-link, .footer-top, .mob-link')
    .forEach(el => {
      el.addEventListener('mouseenter', () => setCursor('link', 'VIEW'));
      el.addEventListener('mouseleave', () => setCursor(null));
    });
  document.querySelectorAll('.btn, .theme-toggle, .hamburger, .social-btn, .ci-social-btn, .ci-email, .skill-tab')
    .forEach(el => {
      el.addEventListener('mouseenter', () => setCursor('btn'));
      el.addEventListener('mouseleave', () => setCursor(null));
    });
  document.querySelectorAll('.hero-avatar, .project-img, .id-avatar, .pf-browser')
    .forEach(el => {
      el.addEventListener('mouseenter', () => setCursor('img', 'EXPLORE'));
      el.addEventListener('mouseleave', () => setCursor(null));
    });
}

/* ═══════════════════════════════════════════
   2. NAV — scroll shrink + active dot
═══════════════════════════════════════════ */
const nav = document.getElementById('mainNav');
let lastScroll = 0;
function onNavScroll() {
  const sy = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', sy > 50);
  lastScroll = sy;
}
addEventListener('scroll', onNavScroll, { passive: true });
onNavScroll();

/* ═══════════════════════════════════════════
   3. LOGO — smooth scroll to top
═══════════════════════════════════════════ */
document.querySelectorAll('.nav-logo').forEach(logo => {
  logo.addEventListener('click', e => {
    const href = logo.getAttribute('href');
    if (href === 'index.html' || href === '/' || href === '') {
      if (window.location.pathname.split('/').pop().replace('.html','') === 'index'
          || window.location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });
});

/* ═══════════════════════════════════════════
   4. MOBILE MENU — spring open/close + backdrop
═══════════════════════════════════════════ */
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');

// Inject backdrop
let backdrop = document.getElementById('menuBackdrop');
if (!backdrop) {
  backdrop = document.createElement('div');
  backdrop.id = 'menuBackdrop';
  backdrop.className = 'mobile-menu-backdrop';
  document.body.appendChild(backdrop);
}

function openMenu() {
  ham.classList.add('open');
  mob.classList.add('open');
  backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  ham.classList.remove('open');
  mob.classList.remove('open');
  backdrop.classList.remove('show');
  document.body.style.overflow = '';
}

if (ham) ham.addEventListener('click', () => mob.classList.contains('open') ? closeMenu() : openMenu());
if (backdrop) backdrop.addEventListener('click', closeMenu);
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMenu));

/* ═══════════════════════════════════════════
   5. MAGNETIC BUTTONS — desktop only
═══════════════════════════════════════════ */
if (isFine) document.querySelectorAll('.btn-primary, [data-magnetic]').forEach(btn => {
  const RADIUS = 80, MAX_PULL = 8;
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < RADIUS) {
      const pull = Math.min((1 - dist / RADIUS) * 0.5, 1);
      const px = Math.sign(dx) * Math.min(Math.abs(dx * pull), MAX_PULL);
      const py = Math.sign(dy) * Math.min(Math.abs(dy * pull), MAX_PULL);
      btn.style.transform = `translate(${px}px, ${py - 2}px)`;
      btn.style.transition = 'transform 0.08s ease';
    }
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    btn.style.transform = '';
    setTimeout(() => btn.style.transition = '', 700);
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.1s ease';
  });
});

/* ═══════════════════════════════════════════
   6. CARD 3D TILT + GLOSS — desktop only
      Touch devices get tap-glow instead
═══════════════════════════════════════════ */
const cardSelector = '.glass-card, .project-card, .pf-card, .tl-card, .value-card, .jstat, .exp-card';

// Touch tap-glow (mobile)
if (!isFine) {
  document.querySelectorAll(cardSelector).forEach(card => {
    card.addEventListener('touchstart', () => {
      card.style.boxShadow = '0 0 0 2px rgba(99,179,237,0.5), 0 0 20px rgba(99,179,237,0.15)';
      card.style.transition = 'box-shadow 0.1s ease';
    }, { passive: true });
    card.addEventListener('touchend', () => {
      setTimeout(() => {
        card.style.boxShadow = '';
        card.style.transition = 'box-shadow 0.4s ease';
      }, 200);
    }, { passive: true });
  });
}

// Desktop 3D tilt
if (isFine) document.querySelectorAll(cardSelector).forEach(card => {
  if (!card.querySelector('.card-gloss')) {
    const gloss = document.createElement('div');
    gloss.className = 'card-gloss';
    gloss.style.cssText = `
      position:absolute;inset:0;border-radius:inherit;pointer-events:none;
      background:radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.06) 0%, transparent 60%);
      opacity:0;transition:opacity 0.3s ease;z-index:1;
    `;
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(gloss);
  }
  const gloss = card.querySelector('.card-gloss');
  const MAX = 7;

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.12s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    if (gloss) gloss.style.opacity = '1';
  });
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top)  / r.height;
    const rx = (cy - 0.5) * MAX * -2;
    const ry = (cx - 0.5) * MAX *  2;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.01)`;
    if (gloss) { gloss.style.setProperty('--gx', (cx*100)+'%'); gloss.style.setProperty('--gy', (cy*100)+'%'); }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.65s cubic-bezier(0.16,1,0.3,1), box-shadow 0.65s ease, border-color 0.3s ease';
    card.style.transform = '';
    if (gloss) gloss.style.opacity = '0';
  });
});

/* ═══════════════════════════════════════════
   7. FORM FIELD INTERACTIONS — validate + flip
═══════════════════════════════════════════ */
document.querySelectorAll('.cf-field').forEach(field => {
  const input = field.querySelector('.cf-input');
  if (!input) return;

  // Inject icon + error message containers
  if (!field.querySelector('.field-icon')) {
    const icon = document.createElement('span'); icon.className = 'field-icon';
    field.appendChild(icon);
  }
  if (!field.querySelector('.field-error-msg')) {
    const msg = document.createElement('div'); msg.className = 'field-error-msg';
    msg.textContent = 'This field is required';
    field.appendChild(msg);
  }

  // Live validation on blur
  input.addEventListener('blur', () => {
    if (input.value.trim()) {
      field.classList.remove('is-error');
      field.classList.add('is-valid');
      input.classList.remove('shake');
      // email format check
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        field.classList.remove('is-valid');
        field.classList.add('is-error');
        field.querySelector('.field-error-msg').textContent = 'Please enter a valid email';
      }
    } else {
      field.classList.remove('is-valid');
    }
  });

  // Clear error on focus
  input.addEventListener('focus', () => {
    field.classList.remove('is-error');
    input.classList.remove('shake');
  });
});

// Form submit with flip transition
const contactForm = document.getElementById('contactForm');
const cfSuccess   = document.getElementById('cfSuccess');
const cfSubmit    = document.getElementById('cfSubmit');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('.cf-input').forEach(input => {
      const field = input.closest('.cf-field');
      if (!input.value.trim()) {
        valid = false;
        field.classList.add('is-error');
        input.classList.remove('shake');
        void input.offsetWidth; // reflow to restart animation
        input.classList.add('shake');
      }
    });
    if (!valid) return;

    // Loading state
    if (cfSubmit) cfSubmit.classList.add('btn-loading');

    setTimeout(() => {
      if (cfSubmit) cfSubmit.classList.remove('btn-loading');
      // Flip transition
      contactForm.classList.add('flip-out');
      setTimeout(() => {
        contactForm.style.display = 'none';
        if (cfSuccess) {
          cfSuccess.style.display = 'flex';
          cfSuccess.classList.add('flip-in');
        }
      }, 400);
    }, 1400);
  });
}

/* ═══════════════════════════════════════════
   8. SECTION SCANNER BEAM — one-shot on scroll
═══════════════════════════════════════════ */
const scanSections = document.querySelectorAll('section:not(.page-hero)');
const scanned = new WeakSet();

const scanObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting || scanned.has(e.target)) return;
    scanned.add(e.target);
    // Inject scanner
    const beam = document.createElement('div');
    beam.className = 'section-scanner';
    e.target.style.position = e.target.style.position || 'relative';
    e.target.appendChild(beam);
    requestAnimationFrame(() => {
      beam.classList.add('scan');
      setTimeout(() => beam.remove(), 1100);
    });
    scanObs.unobserve(e.target);
  });
}, { threshold: 0.08 });
scanSections.forEach(s => scanObs.observe(s));

/* ═══════════════════════════════════════════
   9. SCROLL PROGRESS INDICATOR
═══════════════════════════════════════════ */
const scrollBar = document.getElementById('scrollProgress');
function updateScrollProgress() {
  if (!scrollBar) return;
  const doc = document.documentElement;
  const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
  scrollBar.style.height = Math.min(100, pct) + '%';
}
addEventListener('scroll', updateScrollProgress, { passive: true });

/* ═══════════════════════════════════════════
   10. PARALLAX — subtle background shift
═══════════════════════════════════════════ */
function updateParallax() {
  const sy = window.scrollY;
  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg) heroBg.style.transform = `translateY(${sy * 0.3}px)`;
}
addEventListener('scroll', updateParallax, { passive: true });

/* ═══════════════════════════════════════════
   11. SECTION DEPTH SHIFT on enter/exit
═══════════════════════════════════════════ */
const depthObs = new IntersectionObserver(entries => {
  entries.forEach(e => e.target.classList.toggle('in-view', e.isIntersecting));
}, { threshold: 0.1 });
document.querySelectorAll('section').forEach(s => {
  s.classList.add('section-depth');
  depthObs.observe(s);
});

/* ═══════════════════════════════════════════
   12. HERO ENTRY SAFETY — show if loader stalls
═══════════════════════════════════════════ */
setTimeout(() => {
  document.querySelectorAll('.hero-entry:not(.in)').forEach(el => el.classList.add('in'));
}, 3500);

})();
