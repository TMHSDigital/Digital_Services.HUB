/**
 * Application initialization and common utilities
 */

import { generateToolList } from './template-generator.js';
import { initializeTheme } from './theme.js';

/**
 * Initialize the application
 * Sets up theme, generates tool listings, and handles common functionality
 */
export function initializeApp() {
    try {
        // Initialize theme
        initializeTheme();

        // Generate tool listings if on index page
        const toolsContainer = document.getElementById('tools-container');
        if (toolsContainer) {
            toolsContainer.innerHTML = generateToolList();
        }

        // Initialize navigation
        initializeNavigation();
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Add active state to current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
