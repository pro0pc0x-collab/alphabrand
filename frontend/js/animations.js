// ============================================
// ANIMATIONS.JS - Scroll reveal & counters
// ============================================

// ========== SCROLL REVEAL ==========
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Animate counters inside
      entry.target.querySelectorAll('.counter').forEach(animateCounter);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => revealObserver.observe(el));

// Also observe counters at root level
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ========== COUNTER ==========
function animateCounter(el) {
  if (!el || el.dataset.animated) return;
  el.dataset.animated = 'true';
  const target = parseInt(el.dataset.target || el.textContent);
  if (isNaN(target)) return;
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

// ========== PARALLAX ==========
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ========== HOVER MAGNETIC EFFECT ==========
document.querySelectorAll('.btn-primary, .service-icon').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// ========== TILT CARDS ==========
document.querySelectorAll('.card, .service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ========== CURSOR GLOW ==========
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position:fixed;width:300px;height:300px;border-radius:50%;
  background:radial-gradient(circle,rgba(0,109,91,0.06) 0%,transparent 70%);
  pointer-events:none;z-index:0;transform:translate(-50%,-50%);
  transition:left 0.1s ease,top 0.1s ease;
`;
document.body.appendChild(cursorGlow);
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ========== PAGE TRANSITIONS ==========
document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="tel"]):not([href^="mailto"]):not([href^="https://wa"])').forEach(link => {
  link.addEventListener('click', e => {
    if (link.href && !link.href.includes('javascript')) {
      // Simple fade out
      document.body.style.opacity = '0.7';
      document.body.style.transition = 'opacity 0.2s ease';
    }
  });
});
window.addEventListener('pageshow', () => {
  document.body.style.opacity = '1';
});