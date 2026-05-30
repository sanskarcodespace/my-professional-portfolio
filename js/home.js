/* ══ HOME PAGE JS — REBUILT ══ */
(function() {
'use strict';

// ── HERO LETTER ANIMATION ──────────────────
window.initHeroLetters = function() {
  const heroName = document.getElementById('heroName');
  if (!heroName) return;
  let globalDelay = 0;
  heroName.querySelectorAll('.name-row').forEach(row => {
    const word = row.dataset.word || '';
    row.innerHTML = '';
    [...word].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'hero-letter';
      s.textContent = ch;
      s.style.transitionDelay = `${globalDelay + i * 0.05}s`;
      row.appendChild(s);
    });
    globalDelay += word.length * 0.05 + 0.2;
  });
  setTimeout(() => {
    heroName.querySelectorAll('.hero-letter').forEach(l => l.classList.add('visible'));
  }, 400);
};

// ── HERO ENTRY ANIMATIONS (after loader) ──
window.initHeroEntries = function() {
  // Trigger .hero-anim elements
  document.querySelectorAll('.hero-anim').forEach(el => {
    setTimeout(() => el.classList.add('in'), 50);
  });
  // Trigger portrait entrance
  const portrait = document.getElementById('heroPortrait');
  if (portrait) {
    setTimeout(() => portrait.classList.add('in'), 300);
  }
};

// Auto-init if no loader
if (!document.getElementById('loader')) {
  setTimeout(() => {
    if (window.initHeroLetters) window.initHeroLetters();
    if (window.initHeroEntries) window.initHeroEntries();
  }, 100);
}

// ── TYPEWRITER ─────────────────────────────
const twEl = document.getElementById('typewriterText');
if (twEl) {
  const lines = ['Full Stack Developer','App Developer','Product Builder','Future Startup Founder'];
  let li = 0, ci = 0, del = false;
  const s = { t:50, d:30, pause:1500, short:500 };
  function step() {
    const cur = lines[li];
    if (!del) {
      twEl.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del=true; setTimeout(step,s.pause); return; }
    } else {
      twEl.textContent = cur.slice(0, --ci);
      if (ci === 0) { del=false; li=(li+1)%lines.length; setTimeout(step,s.short); return; }
    }
    setTimeout(step, del ? s.d : s.t);
  }
  setTimeout(step, 1800);
}

// ── HERO PORTRAIT MOUSE REACTIVITY ────────
const portrait = document.getElementById('heroPortrait');
const glowBlue = document.getElementById('glowBlue');
const portraitFrame = portrait ? portrait.querySelector('.portrait-frame') : null;

if (portrait && window.matchMedia('(pointer:fine)').matches) {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;

      // Glow follows cursor at 0.06× — max 30px shift
      if (glowBlue) {
        const gx = 50 + (cx - 0.5) * 12;
        const gy = 10 + (cy - 0.5) * 8;
        glowBlue.style.left = gx + '%';
        glowBlue.style.top = gy + '%';
      }

      // 3D perspective tilt — max ±4°
      if (portraitFrame) {
        const rx = (cy - 0.5) * -8;
        const ry = (cx - 0.5) * 8;
        portraitFrame.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      if (portraitFrame) {
        portraitFrame.style.transform = '';
        portraitFrame.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        setTimeout(() => { if (portraitFrame) portraitFrame.style.transition = 'transform 0.1s ease'; }, 700);
      }
      if (glowBlue) {
        glowBlue.style.left = '50%';
        glowBlue.style.top = '10%';
      }
    });
  }
}

// ── SCROLL CUE HIDE ──────────────────────
const scrollCue = document.getElementById('scrollCue');
if (scrollCue) {
  window.addEventListener('scroll', () => {
    scrollCue.classList.toggle('hidden', window.scrollY > 80);
  }, { passive: true });
}

// ── MARQUEE HOVER PAUSE ────────────────────
const strip = document.getElementById('marqueeStrip');
if (strip) {
  strip.addEventListener('mouseenter', () => {
    strip.querySelectorAll('.marquee-content').forEach(el => el.style.animationPlayState = 'paused');
  });
  strip.addEventListener('mouseleave', () => {
    strip.querySelectorAll('.marquee-content').forEach(el => el.style.animationPlayState = 'running');
  });
}

// ── SLIDE REVEALS ─────────────────────────
const slideObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      slideObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => slideObs.observe(el));

// ── MAGNETIC CTA ──────────────────────────
const ctaBtn = document.querySelector('.magnetic-cta');
if (ctaBtn) {
  ctaBtn.addEventListener('mousemove', e => {
    const r = ctaBtn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width/2);
    const dy = e.clientY - (r.top  + r.height/2);
    ctaBtn.style.transform = `translate(${dx*0.25}px,${dy*0.25}px) translateY(-4px) scale(1.02)`;
  });
  ctaBtn.addEventListener('mouseleave', () => {
    ctaBtn.style.transform = '';
    ctaBtn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    setTimeout(()=>ctaBtn.style.transition='',600);
  });
  ctaBtn.addEventListener('mouseenter', ()=> ctaBtn.style.transition='transform 0.1s ease');
}

// ── PAGE TRANSITION LINKS ─────────────────
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.includes('.pdf')) return;
    e.preventDefault();
    if (window.pageWipe) {
      window.pageWipe(() => { window.location.href = href; });
    } else {
      window.location.href = href;
    }
  });
});

})();
