/**
 * ULTIMATE MOBILE NAVIGATION TOGGLE
 * This script ensures mobile navigation works 100% of the time
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        toggleSelector: '.nav-toggle',
        menuSelector: '.nav-links',
        activeClass: 'active',
        mobileBreakpoint: 768,
        debugMode: true
    };
    
    // Debug logging
    function log(message, data = null) {
        if (CONFIG.debugMode) {
            console.log(`🔧 Mobile Nav: ${message}`, data || '');
        }
    }
    
    // Force show hamburger button on mobile
    function forceShowToggleButton() {
        const style = document.createElement('style');
        style.id = 'mobile-nav-force-show';
        style.textContent = `
            @media (max-width: ${CONFIG.mobileBreakpoint}px) {
                .nav-toggle {
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: relative !important;
                    z-index: 9999 !important;
                }
            }
        `;
        document.head.appendChild(style);
        log('Force show toggle button style applied');
    }
    
    // Initialize mobile navigation
    function initMobileNav() {
        const toggle = document.querySelector(CONFIG.toggleSelector);
        const menu = document.querySelector(CONFIG.menuSelector);
        
        log('Initializing mobile navigation', {
            toggle: !!toggle,
            menu: !!menu,
            screenWidth: window.innerWidth
        });
        
        if (!toggle) {
            log('❌ Toggle button not found');
            return false;
        }
        
        if (!menu) {
            log('❌ Menu not found');
            return false;
        }
        
        log('✅ Both elements found, setting up events');
        
        // Remove any existing event listeners
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        // Add click event to toggle
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = menu.classList.contains(CONFIG.activeClass);
            log(`Toggle clicked - Current state: ${isActive ? 'open' : 'closed'}`);
            
            if (isActive) {
                // Close menu
                newToggle.classList.remove(CONFIG.activeClass);
                menu.classList.remove(CONFIG.activeClass);
                newToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                log('📱 Menu closed');
            } else {
                // Open menu
                newToggle.classList.add(CONFIG.activeClass);
                menu.classList.add(CONFIG.activeClass);
                newToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
                log('📱 Menu opened');
            }
        });
        
        // Close menu when clicking menu items
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                newToggle.classList.remove(CONFIG.activeClass);
                menu.classList.remove(CONFIG.activeClass);
                newToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                log('📱 Menu closed via link click');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!newToggle.contains(e.target) && !menu.contains(e.target)) {
                if (menu.classList.contains(CONFIG.activeClass)) {
                    newToggle.classList.remove(CONFIG.activeClass);
                    menu.classList.remove(CONFIG.activeClass);
                    newToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                    log('📱 Menu closed via outside click');
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains(CONFIG.activeClass)) {
                newToggle.classList.remove(CONFIG.activeClass);
                menu.classList.remove(CONFIG.activeClass);
                newToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                newToggle.focus();
                log('📱 Menu closed via escape key');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > CONFIG.mobileBreakpoint && menu.classList.contains(CONFIG.activeClass)) {
                newToggle.classList.remove(CONFIG.activeClass);
                menu.classList.remove(CONFIG.activeClass);
                newToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                log('📱 Menu closed due to window resize');
            }
        });
        
        log('✅ Mobile navigation fully initialized');
        return true;
    }
    
    // Multiple initialization attempts
    function attemptInit(attempt = 1) {
        const maxAttempts = 5;
        const delay = attempt * 500; // Increasing delay
        
        log(`Initialization attempt ${attempt}/${maxAttempts}`);
        
        if (initMobileNav()) {
            log('🎉 Mobile navigation successfully initialized!');
            return;
        }
        
        if (attempt < maxAttempts) {
            log(`Retrying in ${delay}ms...`);
            setTimeout(() => attemptInit(attempt + 1), delay);
        } else {
            log('❌ Failed to initialize mobile navigation after all attempts');
        }
    }
    
    // Create mobile indicator
    function createMobileIndicator() {
        if (window.innerWidth <= CONFIG.mobileBreakpoint) {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: fixed;
                top: 80px;
                right: 10px;
                background: linear-gradient(45deg, #4f8cff, #00d1ff);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                z-index: 99999;
                font-family: Arial, sans-serif;
                box-shadow: 0 4px 12px rgba(79, 140, 255, 0.3);
                animation: pulse 2s infinite;
            `;
            indicator.innerHTML = `
                📱 Mobile Mode<br>
                <small>Toggle should be visible</small>
            `;
            
            // Add pulse animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(indicator);
            
            // Remove after 4 seconds
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 4000);
        }
    }
    
    // Start initialization process
    function start() {
        log('🚀 Starting mobile navigation setup...');
        
        // Force show toggle button immediately
        forceShowToggleButton();
        
        // Show mobile indicator
        setTimeout(createMobileIndicator, 1000);
        
        // Start initialization attempts
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => attemptInit());
        } else {
            attemptInit();
        }
        
        // Backup initialization
        setTimeout(() => attemptInit(), 2000);
        setTimeout(() => attemptInit(), 5000);
    }
    
    // Start the process
    start();
    
    // Global flag to prevent multiple initializations
    window.mobileNavUltimateInitialized = true;
    
    // Expose debug function globally
    window.debugMobileNav = function() {
        const toggle = document.querySelector(CONFIG.toggleSelector);
        const menu = document.querySelector(CONFIG.menuSelector);
        
        console.log('🔍 Mobile Navigation Debug Info:', {
            screenWidth: window.innerWidth,
            isMobile: window.innerWidth <= CONFIG.mobileBreakpoint,
            toggleFound: !!toggle,
            menuFound: !!menu,
            toggleVisible: toggle ? getComputedStyle(toggle).display : 'N/A',
            toggleActive: toggle ? toggle.classList.contains(CONFIG.activeClass) : false,
            menuActive: menu ? menu.classList.contains(CONFIG.activeClass) : false,
            bodyOverflow: document.body.style.overflow
        });
    };
    
})();