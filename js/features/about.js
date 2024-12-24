import { BaseTool } from './base-tool.js';
import { APP_CONFIG } from '../utils/constants.js';

class About extends BaseTool {
    constructor() {
        super();
        this.initializeElements();
        this.setupEventListeners();
        this.initializeAnimations();
    }

    initializeElements() {
        // Stats elements
        this.statsItems = document.querySelectorAll('.stat-item');
        
        // Tool items
        this.toolItems = document.querySelectorAll('.tool-item');
        
        // Feature items
        this.featureItems = document.querySelectorAll('.feature-item');
        
        // Tech items
        this.techItems = document.querySelectorAll('.tech-list li');
    }

    setupEventListeners() {
        // Add hover effects for tool items
        this.toolItems.forEach(item => {
            item.addEventListener('mouseenter', () => this.animateItem(item));
            item.addEventListener('mouseleave', () => this.resetItem(item));
        });

        // Add hover effects for feature items
        this.featureItems.forEach(item => {
            item.addEventListener('mouseenter', () => this.animateItem(item));
            item.addEventListener('mouseleave', () => this.resetItem(item));
        });

        // Add intersection observer for animations
        this.setupIntersectionObserver();
    }

    initializeAnimations() {
        // Initial animations for visible elements
        this.animateVisibleElements();
        
        // Animate stats when they come into view
        this.animateStats();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all animatable elements
        [...this.toolItems, ...this.featureItems, ...this.techItems].forEach(item => {
            observer.observe(item);
        });
    }

    animateVisibleElements() {
        requestAnimationFrame(() => {
            this.toolItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });

            this.featureItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    }

    animateStats() {
        this.statsItems.forEach(item => {
            const numberElement = item.querySelector('.stat-number');
            const targetNumber = parseInt(numberElement.textContent);
            this.animateNumber(numberElement, targetNumber);
        });
    }

    animateNumber(element, target) {
        let current = 0;
        const increment = target / 30; // Divide animation into 30 steps
        const duration = 1500; // Animation duration in milliseconds
        const stepTime = duration / 30;

        const updateNumber = () => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target === 100 ? '%' : '+');
            } else {
                element.textContent = Math.round(current) + (target === 100 ? '%' : '+');
                requestAnimationFrame(() => {
                    setTimeout(updateNumber, stepTime);
                });
            }
        };

        updateNumber();
    }

    animateItem(item) {
        item.style.transform = 'translateY(-10px)';
        item.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
    }

    resetItem(item) {
        item.style.transform = 'translateY(0)';
        item.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
    }
}

// Initialize the about page
const about = new About(); 