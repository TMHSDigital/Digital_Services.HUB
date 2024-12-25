/**
 * UI utilities for Digital Services Hub
 */

import { UI_CONSTANTS, THEMES } from './constants.js';
import utils from './helpers.js';

/**
 * Create a notification container if it doesn't exist
 * @private
 * @returns {HTMLElement} Notification container
 */
function getNotificationContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        container.setAttribute('role', 'status');
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
    }
    return container;
}

export const notifications = {
    /**
     * Show notification message
     * @param {string} message - Message to display
     * @param {string} type - Notification type ('success', 'error', 'info', 'warning')
     * @param {number} [duration] - Duration in milliseconds
     */
    show(message, type = 'info', duration = UI_CONSTANTS.NOTIFICATION_DURATION) {
        const container = getNotificationContainer();
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
        
        const icon = document.createElement('i');
        icon.className = `fas ${this._getIconForType(type)}`;
        notification.appendChild(icon);

        const messageElement = document.createElement('span');
        messageElement.textContent = message;
        notification.appendChild(messageElement);

        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close notification');
        closeButton.onclick = () => this._removeNotification(notification);
        notification.appendChild(closeButton);

        container.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Remove notification after duration
        if (duration !== Infinity) {
            setTimeout(() => {
                this._removeNotification(notification);
            }, duration);
        }
    },

    /**
     * Show success notification
     * @param {string} message - Success message
     * @param {number} [duration] - Duration in milliseconds
     */
    success(message, duration) {
        this.show(message, 'success', duration);
    },

    /**
     * Show error notification
     * @param {string} message - Error message
     * @param {number} [duration] - Duration in milliseconds
     */
    error(message, duration) {
        this.show(message, 'error', duration);
    },

    /**
     * Show warning notification
     * @param {string} message - Warning message
     * @param {number} [duration] - Duration in milliseconds
     */
    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    /**
     * Show info notification
     * @param {string} message - Info message
     * @param {number} [duration] - Duration in milliseconds
     */
    info(message, duration) {
        this.show(message, 'info', duration);
    },

    /**
     * Get icon class for notification type
     * @private
     * @param {string} type - Notification type
     * @returns {string} Icon class
     */
    _getIconForType(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    },

    /**
     * Remove notification element
     * @private
     * @param {HTMLElement} notification - Notification element to remove
     */
    _removeNotification(notification) {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => {
            notification.remove();
            const container = document.getElementById('notification-container');
            if (container && !container.hasChildNodes()) {
                container.remove();
            }
        });
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
     * @param {boolean} [options.closeOnEscape=true] - Whether to close on Escape key
     * @param {boolean} [options.closeOnOverlay=true] - Whether to close on overlay click
     * @returns {Promise} Resolves when modal is closed
     */
    show({ title, content, buttons = {}, closeOnEscape = true, closeOnOverlay = true }) {
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

            // Add default buttons if none provided
            if (Object.keys(buttons).length === 0) {
                buttons.Close = () => {};
            }

            Object.entries(buttons).forEach(([label, callback]) => {
                const button = document.createElement('button');
                button.textContent = label;
                button.className = 'modal-button';
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
            
            if (closeOnOverlay) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });
            }

            if (closeOnEscape) {
                const escapeHandler = (e) => {
                    if (e.key === 'Escape') {
                        closeModal();
                        document.removeEventListener('keydown', escapeHandler);
                    }
                };
                document.addEventListener('keydown', escapeHandler);
            }

            // Trap focus within modal
            this._trapFocus(modal);

            document.body.appendChild(modal);
            requestAnimationFrame(() => {
                modal.classList.add('show');
                // Focus first focusable element
                const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusable) focusable.focus();
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
    },

    /**
     * Trap focus within modal
     * @private
     * @param {HTMLElement} modal - Modal element
     */
    _trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }
};

export const loader = {
    /**
     * Show loader
     * @param {string} [message] - Loading message
     * @param {boolean} [overlay=true] - Whether to show overlay
     * @returns {HTMLElement} Loader element
     */
    show(message = 'Loading...', overlay = true) {
        const loader = document.createElement('div');
        loader.className = `loader${overlay ? ' loader-overlay' : ''}`;
        loader.setAttribute('role', 'alert');
        loader.setAttribute('aria-busy', 'true');
        loader.setAttribute('aria-label', message);

        const spinner = document.createElement('div');
        spinner.className = 'loader-spinner';
        
        const messageElement = document.createElement('div');
        messageElement.className = 'loader-message';
        messageElement.textContent = message;

        loader.appendChild(spinner);
        loader.appendChild(messageElement);
        document.body.appendChild(loader);

        // Prevent background scrolling if overlay
        if (overlay) {
            document.body.style.overflow = 'hidden';
        }

        return loader;
    },

    /**
     * Hide loader
     * @param {HTMLElement} loader - Loader element to hide
     */
    hide(loader) {
        if (loader && loader.parentNode) {
            const hasOverlay = loader.classList.contains('loader-overlay');
            loader.remove();
            if (hasOverlay) {
                document.body.style.overflow = '';
            }
        }
    }
};

export const responsiveHelper = {
    /**
     * Check if viewport is mobile
     * @returns {boolean} Whether viewport is mobile
     */
    isMobile: utils.isMobile,

    /**
     * Add resize listener
     * @param {Function} callback - Callback function
     * @returns {Function} Function to remove listener
     */
    onResize(callback) {
        const handler = utils.debounce(callback, UI_CONSTANTS.DEBOUNCE_DELAY);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }
};

export function initializeSocialShare() {
    document.querySelectorAll('.share-button.copy-link').forEach(button => {
        button.addEventListener('click', async () => {
            const url = button.dataset.url;
            try {
                await navigator.clipboard.writeText(url);
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.classList.add('success');
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-link"></i> Copy Link';
                    button.classList.remove('success');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                showNotification('Failed to copy link', 'error');
            }
        });
    });
} 