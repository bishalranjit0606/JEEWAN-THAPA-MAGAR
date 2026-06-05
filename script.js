(function () {
  'use strict';

  const WA_URL = 'https://wa.me/9779763383633?text=Hi%20Coach%20Jeewan%2C%20I%20want%20to%20start%20training';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isDesktop = !isTouchDevice && window.innerWidth > 768;

  /* --- Mobile Nav --- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navbar = document.getElementById('navbar');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  function setMobileMenuOpen(isOpen) {
    if (navMenu) navMenu.classList.toggle('open', isOpen);
    if (navbar) navbar.classList.toggle('menu-open', isOpen);
    if (navBackdrop) {
      navBackdrop.classList.toggle('is-visible', isOpen);
      navBackdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }
    document.body.classList.toggle('menu-open', isOpen);
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
      }
    }
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = !navMenu.classList.contains('open');
      setMobileMenuOpen(isOpen);
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

    const menuCta = document.querySelector('.nav-cta--menu');
    if (menuCta) menuCta.addEventListener('click', closeMobileMenu);

    if (navBackdrop) navBackdrop.addEventListener('click', closeMobileMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* --- Hero Interactions --- */
  function initHero() {
    const hero = document.getElementById('hero');
    const heroBg = document.getElementById('heroBg');
    const spotlight = document.getElementById('heroSpotlight');
    const imageWrap = document.getElementById('heroImageWrap');
    const magneticBtn = document.getElementById('heroCtaPrimary');

    if (hero) hero.classList.add('is-ready');

    if (prefersReducedMotion || !isDesktop) return;

    let rafId = null;
    let mx = 0.5;
    let my = 0.5;

    function onHeroMouseMove(e) {
      if (!heroBg) return;
      const rect = heroBg.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width;
      my = (e.clientY - rect.top) / rect.height;

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;

        if (spotlight) {
          spotlight.style.left = `${mx * 100}%`;
          spotlight.style.top = `${my * 100}%`;
        }

        if (imageWrap) {
          const rotY = (mx - 0.5) * 3;
          const rotX = (0.5 - my) * 3;
          imageWrap.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
        }

        if (magneticBtn) {
          const btnRect = magneticBtn.getBoundingClientRect();
          const cx = btnRect.left + btnRect.width / 2;
          const cy = btnRect.top + btnRect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const pull = Math.min(8, (120 - dist) / 15);
            magneticBtn.style.transform = `translate(${dx * pull * 0.02}px, ${dy * pull * 0.02}px)`;
          } else {
            magneticBtn.style.transform = '';
          }
        }
      });
    }

    function onHeroMouseLeave() {
      if (imageWrap) imageWrap.style.transform = '';
      if (magneticBtn) magneticBtn.style.transform = '';
    }

    if (hero) {
      hero.addEventListener('mousemove', onHeroMouseMove);
      hero.addEventListener('mouseleave', onHeroMouseLeave);
    }
  }
  initHero();

  /* --- Navbar Scroll --- */
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Scroll Reveal --- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* --- Stat Counter --- */
  function animateCounter(el, target, suffix, duration) {
    if (prefersReducedMotion) {
      el.textContent = target + (suffix || '');
      return;
    }
    const start = performance.now();
    const from = 0;
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(from + (target - from) * eased);
      el.textContent = val + (suffix || '');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statItems = document.querySelectorAll('[data-count]');
  if (statItems.length) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const isDecimal = el.dataset.decimal === 'true';
            if (isDecimal) {
              el.textContent = target + suffix;
            } else {
              animateCounter(el, target, suffix, 1800);
            }
            statObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statItems.forEach((el) => statObserver.observe(el));
  }

  /* --- Before/After — desktop drag slider --- */
  const baDesktopMQ = window.matchMedia('(min-width: 769px)');

  function initBaSliders() {
    document.querySelectorAll('.ba-slider').forEach((slider) => {
      const afterImg = slider.querySelector('.ba-after');
      const handle = slider.querySelector('.ba-handle');
      if (!afterImg || !handle) return;

      let dragging = false;
      let pct = 50;
      let listenersAttached = false;

      function setPosition(percent) {
        pct = Math.max(5, Math.min(95, percent));
        afterImg.style.clipPath = `inset(0 0 0 ${pct}%)`;
        handle.style.left = `${pct}%`;
        slider.setAttribute('aria-valuenow', Math.round(pct));
      }

      function getPercent(clientX) {
        const rect = slider.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
      }

      function onMouseDown(e) {
        dragging = true;
        slider.classList.add('is-dragging');
        setPosition(getPercent(e.clientX));
      }

      function onMouseMove(e) {
        if (!dragging) return;
        e.preventDefault();
        setPosition(getPercent(e.clientX));
      }

      function onMouseUp() {
        dragging = false;
        slider.classList.remove('is-dragging');
      }

      function onKeydown(e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); setPosition(pct - 5); }
        if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(pct + 5); }
      }

      function attachDesktopListeners() {
        if (listenersAttached) return;
        slider.addEventListener('mousedown', onMouseDown);
        slider.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        slider.addEventListener('keydown', onKeydown);
        setPosition(50);
        listenersAttached = true;
      }

      function detachDesktopListeners() {
        if (!listenersAttached) return;
        slider.removeEventListener('mousedown', onMouseDown);
        slider.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        slider.removeEventListener('keydown', onKeydown);
        dragging = false;
        slider.classList.remove('is-dragging');
        listenersAttached = false;
      }

      function syncDesktopMode() {
        if (baDesktopMQ.matches) attachDesktopListeners();
        else detachDesktopListeners();
      }

      syncDesktopMode();
      baDesktopMQ.addEventListener('change', syncDesktopMode);
    });
  }

  /* --- Before/After — mobile tap toggle --- */
  function initBaMobileToggle() {
    document.querySelectorAll('.ba-card').forEach((card) => {
      const slider = card.querySelector('.ba-slider');
      const afterImg = slider?.querySelector('.ba-after');
      const handle = slider?.querySelector('.ba-handle');
      const buttons = card.querySelectorAll('.ba-toggle-btn');
      if (!slider || !afterImg || !handle || !buttons.length) return;

      function showView(view) {
        slider.classList.toggle('is-showing-before', view === 'before');
        slider.classList.toggle('is-showing-after', view === 'after');
        buttons.forEach((btn) => {
          const active = btn.dataset.view === view;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
      }

      function applyMobileState() {
        if (baDesktopMQ.matches) {
          slider.classList.remove('is-showing-before', 'is-showing-after');
          slider.setAttribute('role', 'slider');
          slider.setAttribute('tabindex', '0');
          return;
        }

        afterImg.style.clipPath = '';
        handle.style.left = '';
        slider.removeAttribute('role');
        slider.removeAttribute('tabindex');
        slider.removeAttribute('aria-valuenow');
        slider.classList.remove('is-dragging');
        showView('after');
      }

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (baDesktopMQ.matches) return;
          showView(btn.dataset.view);
        });
      });

      applyMobileState();
      baDesktopMQ.addEventListener('change', applyMobileState);
    });
  }

  initBaSliders();
  initBaMobileToggle();

  /* --- YouTube — open in new tab --- */
  document.querySelectorAll('.video-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.videoId;
      if (id) window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener');
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* --- BMI Calculator --- */
  window.calculateBMI = function () {
    const feet = parseFloat(document.getElementById('feet').value);
    const inches = parseFloat(document.getElementById('inches').value) || 0;
    const weight = parseFloat(document.getElementById('weight').value);
    const resultBox = document.getElementById('result-box');

    if (!feet || !weight) {
      resultBox.classList.add('show');
      document.getElementById('bmi-category').textContent = 'Please fill all fields';
      document.getElementById('bmi-score').textContent = '--';
      document.getElementById('bmi-message').textContent = 'Enter your height and weight to assess.';
      return;
    }

    const heightInMeters = ((feet * 12) + inches) * 0.0254;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    let category = '';
    let message = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      message = 'Focus on caloric surplus and strength training.';
    } else if (bmi < 24.9) {
      category = 'Healthy Weight';
      message = 'Great job! Maintain with balanced nutrition.';
    } else if (bmi < 29.9) {
      category = 'Overweight';
      message = "Let's dial in your macros and cardio.";
    } else {
      category = 'Obesity';
      message = 'We should consult on a specialized plan.';
    }

    document.getElementById('bmi-score').textContent = bmi;
    document.getElementById('bmi-category').textContent = category;
    document.getElementById('bmi-message').textContent = message;
    resultBox.classList.add('show');
  };

  /* --- Certificate Modal --- */
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('certModalImage');
  const closeBtn = document.getElementById('certModalClose');

  function openModal(src, alt) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt || 'Certificate Preview';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.cert-card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const img = card.querySelector('img');
    const open = () => {
      if (img) openModal(img.src, img.alt);
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
  });

  /* --- Sticky WhatsApp hide near footer --- */
  const waSticky = document.getElementById('whatsappSticky');
  const footer = document.querySelector('.footer');
  if (waSticky && footer) {
    const waObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          waSticky.classList.toggle('hide', entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    waObserver.observe(footer);
  }

  /* --- Horizontal Scroll Carousels --- */
  const SCROLL_SELECTORS = [
    '.services-scroll-wrap',
    '.video-grid',
    '.certs-grid'
  ];

  function initCarousels() {
    const THRESHOLD = 8;

    SCROLL_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((viewport) => {
        if (viewport.closest('.scroll-carousel')) return;

        const carousel = document.createElement('div');
        carousel.className = 'scroll-carousel';

        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'scroll-carousel-btn scroll-carousel-btn--prev';
        prevBtn.setAttribute('aria-label', 'Scroll left');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left" aria-hidden="true"></i>';

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'scroll-carousel-btn scroll-carousel-btn--next';
        nextBtn.setAttribute('aria-label', 'Scroll right');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';

        const parent = viewport.parentNode;
        parent.insertBefore(carousel, viewport);
        carousel.appendChild(prevBtn);
        carousel.appendChild(viewport);
        carousel.appendChild(nextBtn);

        const setVisible = (btn, v) => {
          btn.classList.toggle('is-visible', v);
          btn.setAttribute('aria-hidden', v ? 'false' : 'true');
          btn.tabIndex = v ? 0 : -1;
        };

        const maxScroll = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);

        const update = () => {
          const max = maxScroll();
          if (max <= THRESHOLD) {
            setVisible(prevBtn, false);
            setVisible(nextBtn, false);
            return;
          }
          setVisible(prevBtn, viewport.scrollLeft > THRESHOLD);
          setVisible(nextBtn, viewport.scrollLeft < max - THRESHOLD);
        };

        const scroll = (dir) => {
          const amount = Math.max(viewport.clientWidth * 0.8, 260);
          viewport.scrollBy({ left: dir * amount, behavior: 'smooth' });
        };

        prevBtn.addEventListener('click', () => scroll(-1));
        nextBtn.addEventListener('click', () => scroll(1));
        viewport.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);

        if (typeof ResizeObserver !== 'undefined') {
          const ro = new ResizeObserver(update);
          ro.observe(viewport);
          const inner = viewport.firstElementChild;
          if (inner) ro.observe(inner);
        }

        viewport.querySelectorAll('img[loading="lazy"]').forEach((img) => {
          img.addEventListener('load', update, { once: true });
        });

        requestAnimationFrame(update);
        setTimeout(update, 300);
      });
    });
  }
  initCarousels();

  /* --- Update nav CTA href --- */
  const navCta = document.querySelector('.nav-cta');
  if (navCta) navCta.href = WA_URL;
})();
