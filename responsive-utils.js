(function(){
  "use strict";

  function throttle(fn, wait){
    let inThrottle = false;
    return function(...args){
      if (inThrottle) return;
      inThrottle = true;
      requestAnimationFrame(()=>{
        fn.apply(this, args);
        setTimeout(()=>{ inThrottle = false; }, wait);
      });
    };
  }

  class ResponsiveAnimationManager {
    constructor(){
      this.prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
      this.optimize();
      window.addEventListener('resize', throttle(()=>{
        this.isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
        this.optimize();
      }, 250));
    }
    optimize(){
      if (this.prefersReducedMotion){
        document.documentElement.classList.add('reduced-motion');
      }
      // Light mobile tuning for heavy animations
      const heavySelectors = [
        '.bounce', '.pulse', '.shake', '.spin', '.hero', '.hero-buttons .cta-btn'
      ];
      if (this.isMobile){
        heavySelectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            el.style.transitionDuration = '0.2s';
            el.style.animationDuration = '0.3s';
          });
        });
      }
    }
  }

  class TouchGestureManager {
    constructor(){
      this.startX = 0; this.startY = 0; this.endX = 0; this.endY = 0;
      this.bindEvents();
    }
    bindEvents(){
      document.addEventListener('touchstart', (e)=>{
        if (!e.touches || e.touches.length === 0) return;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      }, { passive: true });
      document.addEventListener('touchmove', (e)=>{
        if (!e.touches || e.touches.length === 0) return;
        this.endX = e.touches[0].clientX;
        this.endY = e.touches[0].clientY;
      }, { passive: true });
      document.addEventListener('touchend', ()=>{
        this.detectSwipe();
      }, { passive: true });
    }
    detectSwipe(){
      const deltaX = this.endX - this.startX;
      const deltaY = this.endY - this.startY;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50){
        if (deltaX > 0){ this.onSwipeRight(); } else { this.onSwipeLeft(); }
      }
      // reset
      this.startX = this.startY = this.endX = this.endY = 0;
    }
    onSwipeLeft(){
      // Close mobile nav on swipe left
      const nav = document.querySelector('.nav-links');
      if (nav && nav.classList.contains('active')){
        nav.classList.remove('active');
        const toggle = document.querySelector('.nav-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
      console.log('Swipe left detected');
    }
    onSwipeRight(){
      // Open mobile nav on swipe right (when near left edge)
      if (window.innerWidth <= 768){
        const nav = document.querySelector('.nav-links');
        if (nav && !nav.classList.contains('active')){
          nav.classList.add('active');
          const toggle = document.querySelector('.nav-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'true');
        }
      }
      console.log('Swipe right detected');
    }
  }

  class LazyLoadManager {
    constructor(){
      if (!('IntersectionObserver' in window)) return;
      this.imageObserver = new IntersectionObserver(this.onIntersect.bind(this), { rootMargin: '100px' });
      this.init();
    }
    init(){
      document.querySelectorAll('img[data-src]').forEach(img => this.imageObserver.observe(img));
    }
    onIntersect(entries){
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          this.imageObserver.unobserve(img);
        }
      });
    }
  }

  class KeyboardNavigationManager {
    constructor(){
      this.focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      this.bindEvents();
    }
    bindEvents(){
      document.addEventListener('keydown', (e)=>{
        if (e.key === 'Tab') {
          const focused = document.activeElement;
          if (focused) {
            focused.classList.add('keyboard-focused');
            setTimeout(()=> focused.classList.remove('keyboard-focused'), 1500);
          }
        }
        if (e.key === 'Escape'){
          this.closeOverlays();
        }
      });
    }
    closeOverlays(){
      const nav = document.querySelector('.nav-links');
      if (nav && nav.classList.contains('active')){
        nav.classList.remove('active');
        const toggle = document.querySelector('.nav-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  class ResponsiveTestSuite {
    constructor(){
      // Run minimal checks on load
      window.addEventListener('load', ()=> this.run());
    }
    run(){
      try {
        const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth + 1;
        console.assert(!hasHorizontalScroll, 'Horizontal scroll detected');
        // Touch target check
        document.querySelectorAll('button, a, input').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width && rect.height) {
            console.assert(rect.height >= 44 && rect.width >= 44 || el.closest('.nav-links'), 'Touch target too small', el);
          }
        });
      } catch(e){
        console.warn('Responsive tests encountered an issue:', e);
      }
    }
  }

  function initMobileNav(){
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav-links');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', ()=>{
      const isActive = nav.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      document.body.style.overflow = isActive && window.innerWidth <= 768 ? 'hidden' : '';
    });
  }

  function init(){
    new ResponsiveAnimationManager();
    new TouchGestureManager();
    new LazyLoadManager();
    new KeyboardNavigationManager();
    new ResponsiveTestSuite();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();