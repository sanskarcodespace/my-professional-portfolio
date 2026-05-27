/* ════════════════════════════════════════════
   MICROINTERACTIONS.JS — Premium Polish Layer
   Email copy · Theme ripple · Nav trails ·
   Haptic buttons · Page title · Scroll-to-top ·
   Building status · GitHub counter
════════════════════════════════════════════ */
(function () {
'use strict';

const isFine = window.matchMedia('(pointer: fine)').matches;

/* ═══════════════════════════════════════════
   1. SCROLL-TO-TOP BUTTON
═══════════════════════════════════════════ */
const stb = document.createElement('button');
stb.id = 'scrollTopBtn';
stb.setAttribute('aria-label', 'Scroll to top');
stb.innerHTML = '↑';
document.body.appendChild(stb);

window.addEventListener('scroll', () => {
  stb.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

stb.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ═══════════════════════════════════════════
   2. BUTTON HAPTIC PRESS
═══════════════════════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.remove('haptic');
    void btn.offsetWidth;
    btn.classList.add('haptic');
    setTimeout(() => btn.classList.remove('haptic'), 220);
  });
});

/* ═══════════════════════════════════════════
   3. THEME TOGGLE RIPPLE EFFECT
═══════════════════════════════════════════ */
const toggle = document.getElementById('themeToggle');
if (toggle) {
  // Inject ripple element
  let ripple = document.getElementById('themeRipple');
  if (!ripple) {
    ripple = document.createElement('div');
    ripple.id = 'themeRipple';
    document.body.appendChild(ripple);
  }

  toggle.addEventListener('click', () => {
    const rect = toggle.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const size = Math.max(innerWidth, innerHeight) * 2.5;

    ripple.style.cssText = `
      left: ${cx - size / 2}px;
      top: ${cy - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      background: ${document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(5,5,8,0.08) 0%, transparent 70%)'
      };
    `;
    ripple.classList.remove('ripple-active');
    void ripple.offsetWidth;
    ripple.classList.add('ripple-active');
    setTimeout(() => ripple.classList.remove('ripple-active'), 650);
  });
}

/* ═══════════════════════════════════════════
   4. NAV HOVER TRAILS (desktop only)
═══════════════════════════════════════════ */
if (isFine) {
  const navEl = document.querySelector('.nav-links');
  if (navEl) {
    let lastTrail = 0;
    navEl.addEventListener('mousemove', e => {
      const now = performance.now();
      if (now - lastTrail < 40) return; // throttle
      lastTrail = now;
      const dot = document.createElement('div');
      dot.className = 'nav-trail-dot';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 420);
    }, { passive: true });
  }
}

/* ═══════════════════════════════════════════
   5. PAGE TITLE CYCLING
═══════════════════════════════════════════ */
const titles = [
  'Sanskar Sharma | Portfolio',
  '🚀 Full Stack Developer',
  '💡 Future Founder',
  '⚡ Building the Future'
];
let titleIdx = 0;
setInterval(() => {
  titleIdx = (titleIdx + 1) % titles.length;
  document.title = titles[titleIdx];
}, 4000);

/* ═══════════════════════════════════════════
   6. EMAIL COPY INTERACTION (Contact page)
═══════════════════════════════════════════ */
const emailBtn = document.querySelector('.ci-email, #copyEmailBtn, [data-copy-email]');
if (emailBtn) {
  // Create tooltips
  const hintTip = document.createElement('span');
  hintTip.className = 'email-tooltip hint';
  hintTip.textContent = 'Click to copy';
  const copiedTip = document.createElement('span');
  copiedTip.className = 'email-tooltip copied';
  copiedTip.textContent = 'Email copied! ✓';

  emailBtn.style.position = 'relative';
  emailBtn.appendChild(hintTip);
  emailBtn.appendChild(copiedTip);

  emailBtn.addEventListener('mouseenter', () => {
    if (!copiedTip.classList.contains('show')) {
      hintTip.classList.add('show');
    }
  });
  emailBtn.addEventListener('mouseleave', () => {
    hintTip.classList.remove('show');
  });

  emailBtn.addEventListener('click', () => {
    const email = emailBtn.getAttribute('data-email') || emailBtn.textContent.trim();
    navigator.clipboard.writeText(email).catch(() => {
      const t = document.createElement('textarea');
      t.value = email; document.body.appendChild(t);
      t.select(); document.execCommand('copy'); t.remove();
    });
    hintTip.classList.remove('show');
    copiedTip.classList.add('show');
    setTimeout(() => copiedTip.classList.remove('show'), 2200);
  });
}

/* ═══════════════════════════════════════════
   7. CURRENTLY BUILDING INDICATOR
═══════════════════════════════════════════ */
const footer = document.querySelector('.footer-inner');
if (footer) {
  const statusLink = document.createElement('a');
  statusLink.href = 'projects.html';
  statusLink.className = 'building-status';
  statusLink.setAttribute('data-page', '');
  statusLink.innerHTML = '<span class="status-dot"></span> Currently building...';
  footer.insertBefore(statusLink, footer.lastElementChild);
}

/* ═══════════════════════════════════════════
   8. GITHUB REPO COUNT (slot-machine animation)
═══════════════════════════════════════════ */
const ghLinks = document.querySelectorAll('a[href*="github.com"]');
if (ghLinks.length > 0) {
  // Only fetch once per session
  const cached = sessionStorage.getItem('gh_repos');
  function animateCount(el, target) {
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 20));
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(timer);
    }, 40);
  }

  function showCount(count) {
    ghLinks.forEach(link => {
      if (link.querySelector('.gh-count')) return;
      const badge = document.createElement('span');
      badge.className = 'gh-count tech-pill slot-num';
      badge.style.marginLeft = '8px';
      badge.textContent = '0';
      link.appendChild(badge);
      // Animate when visible
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animateCount(badge, count);
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      obs.observe(link);
    });
  }

  if (cached) {
    showCount(parseInt(cached));
  } else {
    fetch('https://api.github.com/users/sanskarsharma')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.public_repos != null) {
          sessionStorage.setItem('gh_repos', data.public_repos);
          showCount(data.public_repos);
        }
      })
      .catch(() => {}); // silent fail
  }
}

/* ═══════════════════════════════════════════
   9. SOCIAL LINKS — target blank + rel
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="http"], a[href*="github.com"], a[href*="linkedin.com"], a[href*="twitter.com"]').forEach(a => {
  if (!a.getAttribute('target')) a.setAttribute('target', '_blank');
  if (!a.getAttribute('rel')) a.setAttribute('rel', 'noopener noreferrer');
});

/* ═══════════════════════════════════════════
   10. WILL-CHANGE MANAGEMENT — add on enter, remove on leave
═══════════════════════════════════════════ */
if (isFine) {
  document.querySelectorAll('.glass-card, .btn, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => { el.style.willChange = 'transform'; });
    el.addEventListener('mouseleave', () => {
      setTimeout(() => { el.style.willChange = 'auto'; }, 400);
    });
  });
}

})();
