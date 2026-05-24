// ════════════════════════════════════════════
// SANSKAR PORTFOLIO — app.js
// ════════════════════════════════════════════

const root = document.documentElement;

// ── THEME ──────────────────────────────────
const toggle = document.getElementById('themeToggle');
let dark = true;
toggle.addEventListener('click', () => {
  dark = !dark;
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  initParticles();
});

// ── NAV SCROLL ─────────────────────────────
const nav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
  });
}, { passive: true });

// ── HAMBURGER ──────────────────────────────
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mob.classList.toggle('open');
  document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    ham.classList.remove('open');
    mob.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── MAGNETIC NAV ───────────────────────────
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0,0)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
  });
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'transform 0.1s ease';
  });
});

// ── HERO LETTER ANIMATION ──────────────────
function initHeroLetters() {
  const heroName = document.getElementById('heroName');
  if (!heroName) return;
  const rows = heroName.querySelectorAll('.name-row');
  let globalDelay = 0;

  rows.forEach(row => {
    const word = row.dataset.word || '';
    const isGradient = row.classList.contains('gradient-text');
    row.innerHTML = ''; // clear

    [...word].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'hero-letter';
      span.textContent = char;
      span.style.transitionDelay = `${globalDelay + i * 0.04}s`;
      row.appendChild(span);
    });

    globalDelay += word.length * 0.04 + 0.08;

    // If gradient row, re-apply gradient to row so clip works on children
    if (isGradient) {
      row.style.background = 'var(--gradient-hero)';
      row.style.webkitBackgroundClip = 'text';
      row.style.webkitTextFillColor = 'transparent';
      row.style.backgroundClip = 'text';
      row.style.display = 'inline-block';
      row.style.width = '100%';
    }
  });

  // Trigger after short delay for dramatic entrance
  requestAnimationFrame(() => {
    setTimeout(() => {
      heroName.querySelectorAll('.hero-letter').forEach(l => l.classList.add('visible'));
    }, 300);
  });
}
initHeroLetters();

// ── TYPEWRITER ─────────────────────────────
const typewriterEl = document.getElementById('typewriterText');
if (typewriterEl) {
  const lines = [
    'Building the future before it exists.',
    'Crafting AI-powered experiences.',
    'From Patna to the world.',
    'Full Stack · Flutter · AI.'
  ];
  let lineIdx = 0, charIdx = 0, deleting = false;
  const speed = { type: 58, delete: 32, pause: 2200, pauseShort: 600 };

  function typeStep() {
    const currentLine = lines[lineIdx];
    if (!deleting) {
      typewriterEl.textContent = currentLine.slice(0, ++charIdx);
      if (charIdx === currentLine.length) {
        deleting = true;
        setTimeout(typeStep, speed.pause);
        return;
      }
    } else {
      typewriterEl.textContent = currentLine.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
        setTimeout(typeStep, speed.pauseShort);
        return;
      }
    }
    setTimeout(typeStep, deleting ? speed.delete : speed.type);
  }
  // Delay start until after letter animation
  setTimeout(typeStep, 1400);
}

// ── TAGLINE GRADIENT MOUSE SHIFT ───────────
const taglineEl = document.querySelector('.tagline-static');
if (taglineEl && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    const cx = e.clientX / window.innerWidth;  // 0–1
    const angle = 100 + cx * 70;               // 100deg – 170deg
    taglineEl.style.background = `linear-gradient(${angle}deg, var(--text-secondary) 0%, var(--accent-primary) 100%)`;
    taglineEl.style.webkitBackgroundClip = 'text';
    taglineEl.style.webkitTextFillColor = 'transparent';
    taglineEl.style.backgroundClip = 'text';
  }, { passive: true });
}

// ── SECTION TITLE WORD-SPLIT REVEAL ────────
function initWordSplit() {
  document.querySelectorAll('.section-title').forEach(title => {
    // Rebuild inner HTML preserving <br/> and <span> (gradient-text)
    const rawHTML = title.innerHTML;
    const parts = rawHTML.split(/(<br\s*\/?> |<br\s*\/?>)/gi);
    let rebuilt = '';
    let wordDelay = 0;

    parts.forEach(part => {
      if (/^<br/i.test(part)) {
        rebuilt += '<br/>';
      } else if (/^<span/i.test(part)) {
        // extract inner text of span for word splitting
        const tmp = document.createElement('div');
        tmp.innerHTML = part;
        const spanEl = tmp.firstChild;
        const cls = spanEl ? (spanEl.className || '') : '';
        const innerText = spanEl ? spanEl.textContent : part;
        innerText.split(' ').forEach((word, i) => {
          if (!word) return;
          const delay = (wordDelay++ * 0.12).toFixed(2);
          rebuilt += `<span class="word-wrap"><span class="word-inner ${cls}" style="--delay:${delay}s">${word}</span></span> `;
        });
      } else {
        part.split(' ').forEach(word => {
          if (!word) return;
          const delay = (wordDelay++ * 0.12).toFixed(2);
          rebuilt += `<span class="word-wrap"><span class="word-inner" style="--delay:${delay}s">${word}</span></span> `;
        });
      }
    });
    title.innerHTML = rebuilt;
  });
}
initWordSplit();

// ── INTERSECTION OBSERVER — unified ────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el.classList.contains('reveal')) el.classList.add('visible');
    if (el.classList.contains('section-title')) el.classList.add('words-visible');
    revealObs.unobserve(el);
  });
}, { threshold: 0.05, rootMargin: '200px 0px 0px 0px' });

document.querySelectorAll('.reveal, .section-title').forEach((el, i) => {
  if (el.closest('#home')) return; // hero handled by loader cascade
  el.style.transitionDelay = `${(i % 4) * 0.07}s`;
  revealObs.observe(el);
});

// Force-reveal anything already visible in viewport on page load
function forceRevealVisible() {
  document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)').forEach(el => {
    if (el.closest('#home')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      el.classList.add('visible');
    }
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(forceRevealVisible, 50);
    setTimeout(forceRevealVisible, 300);
    setTimeout(forceRevealVisible, 800);
  });
} else {
  setTimeout(forceRevealVisible, 50);
  setTimeout(forceRevealVisible, 300);
  setTimeout(forceRevealVisible, 800);
}

// ── PARTICLES ──────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
if (!canvas || !ctx) { /* no particle canvas on this page */ }
let particles = [];
let animId;

function resize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
if (canvas) { window.addEventListener('resize', resize, { passive: true }); resize(); }

function initParticles() {
  cancelAnimationFrame(animId);
  particles = [];
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1200;
  const maxParticles = isMobile ? 25 : isTablet ? 50 : 90;
  const count = Math.min(maxParticles, Math.floor(window.innerWidth / 14));
  const isDark = root.getAttribute('data-theme') !== 'light';
  const colors = isDark
    ? ['rgba(99,179,237,', 'rgba(159,122,234,', 'rgba(79,209,197,']
    : ['rgba(49,130,206,', 'rgba(107,70,193,', 'rgba(49,151,149,'];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 0.4,
      col: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * 0.45 + 0.1,
    });
  }
  animate();
}

let mouse = { x: -9999, y: -9999 };
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) { p.x += dx / dist * 0.6; p.y += dy / dist * 0.6; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.col + p.a + ')';
    ctx.fill();
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = a.col + (0.18 * (1 - d / 130)) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  animId = requestAnimationFrame(animate);
}
if (canvas && ctx) initParticles();

// ── CONTACT FORM ───────────────────────────
const _cf = document.getElementById('contactForm');
if (_cf) _cf.addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type=submit]');
  btn.textContent = 'Sent! ✓';
  btn.style.background = 'var(--accent-tertiary)';
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    this.reset();
  }, 3000);
});

// ── CURSOR GLOW (desktop) ─────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;pointer-events:none;z-index:9999;
    width:360px;height:360px;border-radius:50%;
    background:radial-gradient(circle,rgba(99,179,237,0.055) 0%,transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.08s ease,top 0.08s ease;
  `;
  document.body.appendChild(glow);
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

// ── MULTI-PAGE: nav active link ──
(function(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mob-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const base = href.split('/').pop();
    if (base === path) link.classList.add('active');
    else link.classList.remove('active');
  });
})();

// ── PAGE TRANSITION LINKS (all pages) ──
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.includes('.pdf')) return;
    e.preventDefault();
    if (window.pageWipe) window.pageWipe(() => { window.location.href = href; });
    else window.location.href = href;
  });
});



// ── SLIDE REVEALS (reveal-left / reveal-right) — all pages ──
const slideObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      slideObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '100px 0px 0px 0px' });
document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => slideObs.observe(el));
