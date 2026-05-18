/* ══ HOME PAGE JS ══ */
(function() {
'use strict';

// ── HERO LETTER ANIMATION ──────────────────
window.initHeroLetters = function() {
  const heroName = document.getElementById('heroName');
  if (!heroName) return;
  let globalDelay = 0;
  heroName.querySelectorAll('.name-row').forEach(row => {
    const word = row.dataset.word || '';
    const isGrad = row.classList.contains('gradient-text');
    row.innerHTML = '';
    [...word].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'hero-letter';
      s.textContent = ch;
      s.style.transitionDelay = `${globalDelay + i * 0.04}s`;
      row.appendChild(s);
    });
    if (isGrad) {
      row.style.cssText += 'background:var(--gradient-hero);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:block;';
    }
    globalDelay += word.length * 0.04 + 0.1;
  });
  setTimeout(() => {
    heroName.querySelectorAll('.hero-letter').forEach(l => l.classList.add('visible'));
  }, 350);
};

// ── TYPEWRITER ─────────────────────────────
const twEl = document.getElementById('typewriterText');
if (twEl) {
  const lines = ['Full Stack Developer','App Developer','Product Builder','Future Founder'];
  let li = 0, ci = 0, del = false;
  const s = { t:60, d:35, pause:2000, short:500 };
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
  setTimeout(step, 1600);
}

// ── AVATAR MOUSE REACTIVE HALO ─────────────
const halo = document.getElementById('avatarHalo');
if (halo && window.matchMedia('(pointer:fine)').matches) {
  document.addEventListener('mousemove', e => {
    const cx = e.clientX / window.innerWidth;
    const cy = e.clientY / window.innerHeight;
    const ox = (cx - 0.5) * 60;
    const oy = (cy - 0.5) * 60;
    halo.style.background = `radial-gradient(circle at ${50+ox*0.5}% ${50+oy*0.5}%, rgba(99,179,237,0.22) 0%, rgba(159,122,234,0.14) 50%, transparent 70%)`;
    halo.style.transform = `translate(${ox*0.1}px, ${oy*0.1}px)`;
  }, { passive: true });
}

// ── SCROLL INDICATOR HIDE ──────────────────
const si = document.getElementById('scrollIndicator');
if (si) {
  window.addEventListener('scroll', () => {
    si.classList.toggle('hidden', window.scrollY > window.innerHeight * 0.3);
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
