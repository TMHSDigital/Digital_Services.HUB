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
        const toolsGrid = document.getElementById('tools-grid');
        if (toolsGrid) {
            toolsGrid.innerHTML = generateToolList();
        }

        // Initialize smooth scrolling
        initializeSmoothScroll();

        // Initialize navigation
        initializeNavigation();
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
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

    // Handle mobile navigation
    const themeToggle = document.querySelector('.theme-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (window.innerWidth <= 768) {
        const menuButton = document.createElement('button');
        menuButton.className = 'menu-toggle';
        menuButton.setAttribute('aria-label', 'Toggle navigation menu');
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';

        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            const icon = menuButton.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        document.querySelector('.nav-container').insertBefore(menuButton, themeToggle);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
