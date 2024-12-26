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
    const navLinksContainer = document.querySelector('.nav-links');
    const themeToggle = document.querySelector('.theme-toggle');

    // Set active state
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Handle mobile navigation
    if (window.innerWidth <= 768) {
        const menuButton = document.createElement('button');
        menuButton.className = 'menu-toggle';
        menuButton.setAttribute('aria-label', 'Toggle navigation menu');
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';

        menuButton.addEventListener('click', () => {
            navLinksContainer.classList.toggle('show');
            const icon = menuButton.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        document.querySelector('.nav-container').insertBefore(menuButton, themeToggle);

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && navLinksContainer.classList.contains('show')) {
                navLinksContainer.classList.remove('show');
                const icon = menuButton.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when window is resized above mobile breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinksContainer.classList.contains('show')) {
                navLinksContainer.classList.remove('show');
                const icon = menuButton.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
