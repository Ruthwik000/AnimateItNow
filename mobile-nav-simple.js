// Simple Mobile Navigation - Bulletproof Implementation
(function() {
    'use strict';
    
    function initMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;
        
        console.log('🔧 Mobile Nav Init:', { navToggle, navLinks });
        
        if (!navToggle || !navLinks) {
            console.warn('⚠️ Mobile nav elements not found');
            return;
        }
        
        console.log('✅ Mobile navigation initialized');
        
        // Toggle function
        function toggleMenu() {
            console.log('🔄 Toggle menu clicked');
            
            const isActive = navLinks.classList.contains('active');
            
            if (isActive) {
                // Close menu
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                console.log('📱 Menu closed');
            } else {
                // Open menu
                navToggle.classList.add('active');
                navLinks.classList.add('active');
                navToggle.setAttribute('aria-expanded', 'true');
                body.style.overflow = 'hidden';
                console.log('📱 Menu opened');
            }
        }
        
        // Add click event to toggle button
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking on links
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                console.log('📱 Menu closed via link click');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                if (navLinks.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    body.style.overflow = '';
                    console.log('📱 Menu closed via outside click');
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                navToggle.focus();
                console.log('📱 Menu closed via escape key');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                console.log('📱 Menu closed due to window resize');
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
    
    // Fallback initialization after a delay
    setTimeout(function() {
        if (!window.mobileNavInitialized) {
            console.log('🔄 Running fallback mobile nav initialization');
            initMobileNav();
        }
    }, 2000);
    
    window.mobileNavInitialized = true;
})();