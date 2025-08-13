// Debug Mobile Navigation
(function() {
    'use strict';
    
    // Create debug panel
    function createDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 99999;
            font-family: monospace;
            max-width: 200px;
            display: none;
        `;
        document.body.appendChild(debugPanel);
        return debugPanel;
    }
    
    // Show debug info
    function showDebugInfo() {
        const debugPanel = document.getElementById('debug-panel') || createDebugPanel();
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        const info = `
            Screen: ${window.innerWidth}x${window.innerHeight}
            Mobile: ${window.innerWidth <= 768 ? 'YES' : 'NO'}
            Toggle Found: ${navToggle ? 'YES' : 'NO'}
            Links Found: ${navLinks ? 'YES' : 'NO'}
            Toggle Visible: ${navToggle ? getComputedStyle(navToggle).display : 'N/A'}
            Menu Active: ${navLinks ? navLinks.classList.contains('active') : 'N/A'}
            Toggle Active: ${navToggle ? navToggle.classList.contains('active') : 'N/A'}
        `;
        
        debugPanel.innerHTML = info;
        debugPanel.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            debugPanel.style.display = 'none';
        }, 5000);
    }
    
    // Add debug trigger
    function addDebugTrigger() {
        // Show debug on triple tap/click
        let tapCount = 0;
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'H1' || e.target.tagName === 'H2') {
                tapCount++;
                if (tapCount === 3) {
                    showDebugInfo();
                    tapCount = 0;
                }
                setTimeout(() => { tapCount = 0; }, 1000);
            }
        });
        
        // Show debug on key press (D key)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'd' || e.key === 'D') {
                showDebugInfo();
            }
        });
    }
    
    // Initialize debug
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDebugTrigger);
    } else {
        addDebugTrigger();
    }
    
    // Add visual indicator for mobile navigation
    function addMobileIndicator() {
        if (window.innerWidth <= 768) {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                background: #4f8cff;
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 10px;
                z-index: 99998;
                font-family: Arial, sans-serif;
            `;
            indicator.textContent = 'Mobile Mode Active';
            document.body.appendChild(indicator);
            
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 3000);
        }
    }
    
    // Show mobile indicator
    setTimeout(addMobileIndicator, 1000);
    
})();