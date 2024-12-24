/**
 * UI utilities for Digital Services Hub
 */

import { UI_CONSTANTS, THEMES } from './constants.js';
import utils from './helpers.js';

export const notifications = {
    /**
     * Show notification message
     * @param {string} message - Message to display
     * @param {string} type - Notification type ('success', 'error', 'info', 'warning')
     * @param {number} [duration] - Duration in milliseconds
     */
    show(message, type = 'info', duration = UI_CONSTANTS.NOTIFICATION_DURATION) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');

        document.body.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Remove notification after duration
        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, duration);
    },

    /**
     * Show success notification
     * @param {string} message - Success message
     */
    success(message) {
        this.show(message, 'success');
    },

    /**
     * Show error notification
     * @param {string} message - Error message
     */
    error(message) {
        this.show(message, 'error');
    },

    /**
     * Show warning notification
     * @param {string} message - Warning message
     */
    warning(message) {
        this.show(message, 'warning');
    }
};

export const themeManager = {
    /**
     * Initialize theme manager
     */
    init() {
        const savedTheme = utils.getStorageItem('theme', 'local') || THEMES.SYSTEM;
        this.setTheme(savedTheme);
        this.setupThemeToggle();
        this.setupSystemThemeListener();
    },

    /**
     * Set theme
     * @param {string} theme - Theme to set
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        utils.setStorageItem('theme', theme, 'local');
    },

    /**
     * Setup theme toggle button
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
                this.setTheme(newTheme);
            });
        }
    },

    /**
     * Setup system theme listener
     */
    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (document.documentElement.getAttribute('data-theme') === THEMES.SYSTEM) {
                this.setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
            }
        });
    }
};

export const modal = {
    /**
     * Show modal
     * @param {Object} options - Modal options
     * @param {string} options.title - Modal title
     * @param {string|HTMLElement} options.content - Modal content
     * @param {Object} [options.buttons] - Modal buttons configuration
     * @returns {Promise} Resolves when modal is closed
     */
    show({ title, content, buttons = {} }) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-labelledby', 'modal-title');

            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';

            const modalHeader = document.createElement('div');
            modalHeader.className = 'modal-header';
            
            const titleElement = document.createElement('h2');
            titleElement.id = 'modal-title';
            titleElement.textContent = title;
            modalHeader.appendChild(titleElement);

            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close';
            closeButton.innerHTML = '&times;';
            closeButton.setAttribute('aria-label', 'Close modal');
            modalHeader.appendChild(closeButton);

            const modalBody = document.createElement('div');
            modalBody.className = 'modal-body';
            if (typeof content === 'string') {
                modalBody.innerHTML = content;
            } else {
                modalBody.appendChild(content);
            }

            const modalFooter = document.createElement('div');
            modalFooter.className = 'modal-footer';

            Object.entries(buttons).forEach(([label, callback]) => {
                const button = document.createElement('button');
                button.textContent = label;
                button.addEventListener('click', () => {
                    callback();
                    this.close(modal);
                    resolve();
                });
                modalFooter.appendChild(button);
            });

            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalBody);
            modalContent.appendChild(modalFooter);
            modal.appendChild(modalContent);

            const closeModal = () => {
                this.close(modal);
                resolve();
            };

            closeButton.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });

            document.body.appendChild(modal);
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
        });
    },

    /**
     * Close modal
     * @param {HTMLElement} modal - Modal element to close
     */
    close(modal) {
        modal.classList.remove('show');
        modal.addEventListener('transitionend', () => {
            modal.remove();
        });
    }
};

export const loader = {
    /**
     * Show loader
     * @param {string} [message] - Loading message
     * @returns {HTMLElement} Loader element
     */
    show(message = 'Loading...') {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.setAttribute('role', 'alert');
        loader.setAttribute('aria-busy', 'true');

        const spinner = document.createElement('div');
        spinner.className = 'loader-spinner';
        
        const messageElement = document.createElement('div');
        messageElement.className = 'loader-message';
        messageElement.textContent = message;

        loader.appendChild(spinner);
        loader.appendChild(messageElement);
        document.body.appendChild(loader);

        return loader;
    },

    /**
     * Hide loader
     * @param {HTMLElement} loader - Loader element to hide
     */
    hide(loader) {
        if (loader && loader.parentNode) {
            loader.remove();
        }
    }
};

export const responsiveHelper = {
    /**
     * Check if viewport is mobile
     * @returns {boolean} Whether viewport is mobile
     */
    isMobile() {
        return window.innerWidth < UI_CONSTANTS.MOBILE_BREAKPOINT;
    },

    /**
     * Add resize listener
     * @param {Function} callback - Callback function
     * @returns {Function} Cleanup function
     */
    addResizeListener(callback) {
        const debouncedCallback = utils.debounce(callback, UI_CONSTANTS.DEBOUNCE_DELAY);
        window.addEventListener('resize', debouncedCallback);
        return () => window.removeEventListener('resize', debouncedCallback);
    }
}; 