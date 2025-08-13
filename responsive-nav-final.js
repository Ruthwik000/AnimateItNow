/**
 * ULTIMATE RESPONSIVE NAVIGATION
 * Handles Mobile (≤767px), Tablet (768px-900px), and Desktop (≥901px)
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        toggleSelector: '.nav-toggle',
        menuSelector: '.nav-links',
        activeClass: 'active',
        mobileBreakpoint: 767,
        tabletBreakpoint: 900,
        debugMode: true
    };
    
    let isInitialized = false;
    let currentToggle = null;
    let currentMenu = null;
    
    // Debug logging
    function log(message, data = null) {
        if (CONFIG.debugMode) {
            console.log(`🔧 Responsive Nav: ${message}`, data || '');
        }
    }
    
    // Get current device type
    function getDeviceType() {
        const width = window.innerWidth;
        if (width <= CONFIG.mobileBreakpoint) return 'mobile';
        if (width <= CONFIG.tabletBreakpoint) return 'tablet';
        return 'desktop';
    }
    
    // Force show toggle for mobile and small tablets
    function forceShowToggle() {
        const deviceType = getDeviceType();
        const shouldShow = deviceType === 'mobile' || deviceType === 'tablet';
        
        if (!document.getElementById('responsive-nav-force-show')) {
            const style = document.createElement('style');
            style.id = 'responsive-nav-force-show';
            document.head.appendChild(style);
        }
        
        const style = document.getElementById('responsive-nav-force-show');
        style.textContent = `
            @media (max-width: ${CONFIG.tabletBreakpoint}px) {
                .nav-toggle {
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: relative !important;
                    z-index: 1001 !important;
                }
            }
            @media (min-width: ${CONFIG.tabletBreakpoint + 1}px) {
                .nav-toggle {
                    display: none !important;
                }
                .nav-links {
                    display: flex !important;
                    position: relative !important;
                    transform: none !important;
                    background: transparent !important;
                    flex-direction: row !important;
                    padding: 0 !important;
                    height: auto !important;
                    width: auto !important;
                    top: auto !important;
                    left: auto !important;
                    right: auto !important;
                }
            }
        `;
        
        log(`Force show toggle updated for ${deviceType} device`);
    }
    
    // Initialize navigation functionality
    function initNavigation() {
        const toggle = document.querySelector(CONFIG.toggleSelector);
        const menu = document.querySelector(CONFIG.menuSelector);
        const deviceType = getDeviceType();
        
        log('Initializing navigation', {
            toggle: !!toggle,
            menu: !!menu,
            deviceType,
            screenWidth: window.innerWidth
        });
        
        if (!toggle || !menu) {
            log('❌ Required elements not found');
            return false;
        }
        
        // Clean up existing listeners
        if (currentToggle && currentToggle !== toggle) {
            currentToggle.replaceWith(currentToggle.cloneNode(true));
        }
        
        currentToggle = toggle;
        currentMenu = menu;
        
        // Only add functionality for mobile and tablet
        if (deviceType === 'mobile' || deviceType === 'tablet') {
            setupMobileNavigation(toggle, menu);
        } else {
            cleanupMobileNavigation(menu);
        }
        
        log(`✅ Navigation initialized for ${deviceType}`);
        return true;
    }
    
    // Setup mobile/tablet navigation
    function setupMobileNavigation(toggle, menu) {
        log('Setting up mobile/tablet navigation');
        
        // Ensure proper initial state
        toggle.classList.remove(CONFIG.activeClass);
        menu.classList.remove(CONFIG.activeClass);
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // Toggle click handler
        const handleToggleClick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = menu.classList.contains(CONFIG.activeClass);
            log(`Toggle clicked - Current state: ${isActive ? 'open' : 'closed'}`);
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        };
        
        // Open menu
        function openMenu() {
            toggle.classList.add(CONFIG.activeClass);
            menu.classList.add(CONFIG.activeClass);
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            log('📱 Menu opened');
        }
        
        // Close menu
        function closeMenu() {
            toggle.classList.remove(CONFIG.activeClass);
            menu.classList.remove(CONFIG.activeClass);
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            log('📱 Menu closed');
        }
        
        // Add event listeners
        toggle.addEventListener('click', handleToggleClick);
        
        // Close menu when clicking menu items
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
                log('📱 Menu closed via link click');
            });
        });
        
        // Close menu when clicking outside
        const handleOutsideClick = function(e) {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                if (menu.classList.contains(CONFIG.activeClass)) {
                    closeMenu();
                    log('📱 Menu closed via outside click');
                }
            }
        };
        document.addEventListener('click', handleOutsideClick);
        
        // Close menu on escape key
        const handleEscapeKey = function(e) {
            if (e.key === 'Escape' && menu.classList.contains(CONFIG.activeClass)) {
                closeMenu();
                toggle.focus();
                log('📱 Menu closed via escape key');
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        
        // Store cleanup functions
        toggle._cleanup = function() {
            toggle.removeEventListener('click', handleToggleClick);
            document.removeEventListener('click', handleOutsideClick);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }
    
    // Cleanup mobile navigation for desktop
    function cleanupMobileNavigation(menu) {
        log('Cleaning up mobile navigation for desktop');
        
        if (currentToggle && currentToggle._cleanup) {
            currentToggle._cleanup();
        }
        
        menu.classList.remove(CONFIG.activeClass);
        document.body.style.overflow = '';
    }
    
    // Handle window resize
    function handleResize() {
        const deviceType = getDeviceType();
        log(`Window resized - Device type: ${deviceType} (${window.innerWidth}px)`);
        
        // Update force show styles
        forceShowToggle();
        
        // Reinitialize navigation
        setTimeout(() => {
            initNavigation();
        }, 100);
        
        // Close mobile menu if switching to desktop
        if (deviceType === 'desktop' && currentMenu) {
            currentMenu.classList.remove(CONFIG.activeClass);
            if (currentToggle) {
                currentToggle.classList.remove(CONFIG.activeClass);
                currentToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        }
    }
    
    // Create device indicator
    function createDeviceIndicator() {
        const deviceType = getDeviceType();
        const indicator = document.createElement('div');
        indicator.id = 'device-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 80px;
            left: 10px;
            background: linear-gradient(45deg, #4f8cff, #00d1ff);
            color: white;
            padding: 8px 15px;
            border-radius: 25px;
            font-size: 12px;
            font-weight: 600;
            z-index: 99999;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 15px rgba(79, 140, 255, 0.4);
            transition: all 0.3s ease;
        `;
        
        const updateIndicator = () => {
            const currentDevice = getDeviceType();
            const width = window.innerWidth;
            indicator.innerHTML = `
                📱 ${currentDevice.toUpperCase()}<br>
                <small>${width}px wide</small>
            `;
            
            // Color coding
            if (currentDevice === 'mobile') {
                indicator.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e53)';
            } else if (currentDevice === 'tablet') {
                indicator.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
            } else {
                indicator.style.background = 'linear-gradient(45deg, #4f8cff, #00d1ff)';
            }
        };
        
        updateIndicator();
        document.body.appendChild(indicator);
        
        // Update on resize
        window.addEventListener('resize', updateIndicator);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.style.opacity = '0.3';
                indicator.style.transform = 'scale(0.8)';
            }
        }, 5000);
        
        return indicator;
    }
    
    // Multiple initialization attempts
    function attemptInit(attempt = 1) {
        const maxAttempts = 3;
        
        log(`Initialization attempt ${attempt}/${maxAttempts}`);
        
        if (initNavigation()) {
            log('🎉 Navigation successfully initialized!');
            isInitialized = true;
            return true;
        }
        
        if (attempt < maxAttempts) {
            setTimeout(() => attemptInit(attempt + 1), attempt * 1000);
        } else {
            log('❌ Failed to initialize navigation after all attempts');
        }
        return false;
    }
    
    // Main initialization
    function start() {
        if (window.responsiveNavInitialized) {
            log('Navigation already initialized, skipping...');
            return;
        }
        
        log('🚀 Starting responsive navigation setup...');
        
        // Force show toggle immediately
        forceShowToggle();
        
        // Show device indicator
        setTimeout(createDeviceIndicator, 500);
        
        // Initialize navigation
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => attemptInit());
        } else {
            attemptInit();
        }
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 150);
        });
        
        // Mark as initialized
        window.responsiveNavInitialized = true;
    }
    
    // Expose debug function
    window.debugResponsiveNav = function() {
        const deviceType = getDeviceType();
        const toggle = document.querySelector(CONFIG.toggleSelector);
        const menu = document.querySelector(CONFIG.menuSelector);
        
        console.log('🔍 Responsive Navigation Debug Info:', {
            screenWidth: window.innerWidth,
            deviceType: deviceType,
            toggleFound: !!toggle,
            menuFound: !!menu,
            toggleVisible: toggle ? getComputedStyle(toggle).display : 'N/A',
            toggleActive: toggle ? toggle.classList.contains(CONFIG.activeClass) : false,
            menuActive: menu ? menu.classList.contains(CONFIG.activeClass) : false,
            bodyOverflow: document.body.style.overflow,
            isInitialized: isInitialized
        });
    };
    
    // Start the system
    start();
    
})();