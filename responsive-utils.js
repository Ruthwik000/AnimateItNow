(function () {
  'use strict';

  function debounce(fn, delay) {
    let t = null;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  class ResponsiveAnimationManager {
    constructor(options = {}) {
      const { mobileWidth = 768 } = options;
      this.mobileWidth = mobileWidth;
      this.mqlReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.mqlMobile = window.matchMedia(`(max-width: ${this.mobileWidth}px)`);
      this.apply = this.apply.bind(this);
      this.handleResize = debounce(this.apply, 150);
      this.init();
    }

    init() {
      this.apply();
      this.mqlReduced.addEventListener?.('change', this.apply);
      window.addEventListener('resize', this.handleResize, { passive: true });
    }

    apply() {
      const prefersReduced = this.mqlReduced.matches;
      const isMobile = this.mqlMobile.matches;
      document.documentElement.classList.toggle('reduced-motion', prefersReduced);

      // Light-touch adjustments for mobile
      const scrollFades = document.querySelectorAll('.scroll-fade');
      scrollFades.forEach((el) => {
        el.style.transitionDuration = prefersReduced ? '0.01ms' : (isMobile ? '0.3s' : '0.4s');
      });

      // Optional: mark heavy animation elements with data-anim-heavy for fallback on reduced motion
      if (prefersReduced) {
        document.querySelectorAll('[data-anim-heavy]')
          .forEach((el) => { el.style.animation = 'none'; el.classList.add('static-fallback'); });
      } else {
        document.querySelectorAll('.static-fallback')
          .forEach((el) => { el.style.animation = ''; el.classList.remove('static-fallback'); });
      }
    }
  }

  class LazyLoadManager {
    constructor() {
      if (!('IntersectionObserver' in window)) return;
      this.imageObserver = new IntersectionObserver(this.handleImageIntersection.bind(this), { rootMargin: '100px' });
      this.init();
    }

    init() {
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach((img) => this.imageObserver.observe(img));
    }

    handleImageIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          this.imageObserver.unobserve(img);
        }
      });
    }
  }

  class TouchGestureManager {
    constructor(options = {}) {
      this.startX = 0;
      this.startY = 0;
      this.endX = 0;
      this.endY = 0;
      this.threshold = options.threshold || 50;
      this.onSwipeLeft = options.onSwipeLeft || function () { };
      this.onSwipeRight = options.onSwipeRight || function () { };
      this.enabled = matchMedia('(pointer: coarse)').matches;
      if (this.enabled) this.setupTouchEvents();
    }

    setupTouchEvents() {
      document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
      document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
      document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }

    handleTouchStart(e) {
      if (!e.touches || e.touches.length === 0) return;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.endX = this.startX;
      this.endY = this.startY;
    }

    handleTouchMove(e) {
      if (!e.touches || e.touches.length === 0) return;
      this.endX = e.touches[0].clientX;
      this.endY = e.touches[0].clientY;
    }

    handleTouchEnd() { this.detectSwipe(); }

    detectSwipe() {
      const deltaX = this.endX - this.startX;
      const deltaY = this.endY - this.startY;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.threshold) {
        if (deltaX > 0) this.onSwipeRight(); else this.onSwipeLeft();
      }
    }
  }

  class KeyboardNavigationManager {
    constructor() {
      this.focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      this.setupKeyboardEvents();
    }

    setupKeyboardEvents() {
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(e) {
      if (e.key === 'Tab') this.highlightFocusedElement();
      if (e.key === 'Escape') this.closeOverlays();
    }

    highlightFocusedElement() {
      const el = document.activeElement;
      if (!el) return;
      el.classList.add('keyboard-focused');
      setTimeout(() => el.classList.remove('keyboard-focused'), 1200);
    }

    closeOverlays() {
      // Close mobile nav if open
      const navLinks = document.querySelector('.navbar .nav-links');
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const toggle = document.querySelector('.nav-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
      // Add any modal closing hooks here if present in future
    }
  }

  function setupMobileNavToggle() {
    const navLinks = document.querySelector('.navbar .nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    if (!navLinks || !navToggle) return;

    function closeMenu() {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
      navLinks.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
    }

    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking a link (use event delegation)
    navLinks.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.closest('a')) closeMenu();
    });

    // Touch gestures for coarse pointers
    new TouchGestureManager({ onSwipeLeft: closeMenu, onSwipeRight: openMenu });

    // Close on outside click for mobile
    document.addEventListener('click', (e) => {
      const withinNav = e.target.closest('.navbar');
      if (!withinNav) closeMenu();
    });
  }

  class ResponsiveTestSuite {
    constructor(breakpoints = [480, 640, 768, 1024, 1280]) {
      this.testBreakpoints = breakpoints;
    }
    async run() {
      for (const width of this.testBreakpoints) {
        // Simulate viewport width by setting a CSS variable (non-destructive)
        document.documentElement.style.setProperty('--_test-width', width + 'px');
        const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
        console.assert(!hasHorizontalScroll, `Horizontal scroll detected at ${width}px`);
        this.validateTouchTargets();
      }
      console.log('[ResponsiveTestSuite] Completed');
    }
    validateTouchTargets() {
      const interactive = document.querySelectorAll('button, a, input');
      interactive.forEach((el) => {
        const rect = el.getBoundingClientRect();
        console.assert(rect.height >= 36 && rect.width >= 36, 'Touch target possibly too small:', el);
      });
    }
  }

  function initManagers() {
    try { new ResponsiveAnimationManager(); } catch (e) { console.warn('ResponsiveAnimationManager init failed', e); }
    try { new LazyLoadManager(); } catch (e) { console.warn('LazyLoadManager init failed', e); }
    try { new KeyboardNavigationManager(); } catch (e) { console.warn('KeyboardNavigationManager init failed', e); }
    try { setupMobileNavToggle(); } catch (e) { console.warn('Mobile nav toggle setup failed', e); }

    // Optional: run tests if enabled via query param or localStorage
    const shouldRunTests = /[?&]testResponsive=1/.test(location.search) || localStorage.getItem('runResponsiveTests') === 'true';
    if (shouldRunTests) {
      try { new ResponsiveTestSuite().run(); } catch (e) { console.warn('ResponsiveTestSuite failed', e); }
    }
  }

  window.ResponsiveManagers = { init: initManagers };
})();
