/**
 * Application initialization and common utilities
 */

import { initializeTheme } from './theme.js';
import { initializeTools } from '../features/tools-manager.js';
import { injectLayout } from '../components/layout.js';

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking nav links
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
            document.body.classList.remove('menu-open');
        });
    });
}

/**
 * Initialize smooth scrolling for navigation links
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
 * Initialize the application
 */
function initializeApp() {
    // Inject Layout (Header/Footer) first
    injectLayout();

    // Initialize theme system
    initializeTheme();

    // Initialize mobile menu
    initializeMobileMenu();

    // Initialize smooth scroll
    initializeSmoothScroll();

    // Initialize tools grid
    initializeTools();

    // Add scroll-based animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.feature-card, .tools-grid > *, .about-content, .contribute-content')
        .forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
