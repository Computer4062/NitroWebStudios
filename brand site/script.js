document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Route spine — highlight active section as user scrolls
  const stops = document.querySelectorAll('.route__stop');
  const sections = Array.from(stops)
    .map(stop => document.getElementById(stop.dataset.stop))
    .filter(Boolean);

  if (sections.length && stops.length) {
    const setActive = (id) => {
      stops.forEach(stop => {
        stop.classList.toggle('is-active', stop.dataset.stop === id);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
  }

  // Animate circular gauges in the hero cluster once visible
  const gauges = document.querySelectorAll('.gauge');
  const CIRC = 314; // 2 * PI * r(50), matches stroke-dasharray in CSS

  const animateGauge = (gaugeEl) => {
    const value = parseFloat(gaugeEl.dataset.value) || 0;
    const fill = gaugeEl.querySelector('.gauge__fill');
    const valueLabel = gaugeEl.querySelector('.gauge__value');
    const offset = CIRC - (CIRC * Math.min(value, 100)) / 100;

    requestAnimationFrame(() => {
      if (fill) fill.style.strokeDashoffset = String(offset);
    });

    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (valueLabel) valueLabel.textContent = Math.round(eased * value);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (gauges.length) {
    const gaugeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateGauge(entry.target);
          gaugeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    gauges.forEach(g => gaugeObserver.observe(g));
  }

  // Trust ring in "Why Choose Us"
  const trustFill = document.querySelector('.trust-panel__fill');
  if (trustFill) {
    const TRUST_CIRC = 427; // 2 * PI * r(68)
    const trustValue = 78; // visual fill percentage
    const trustObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const offset = TRUST_CIRC - (TRUST_CIRC * trustValue) / 100;
          requestAnimationFrame(() => {
            trustFill.style.strokeDashoffset = String(offset);
          });
          trustObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    trustObserver.observe(trustFill);
  }

  // Contact form (static demo — no backend wired up)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name')?.value.trim();
      status.textContent = name
        ? `Thanks, ${name.split(' ')[0]} — we'll be in touch within 24 hours.`
        : "Thanks — we'll be in touch within 24 hours.";
      form.reset();
    });
  }

});
